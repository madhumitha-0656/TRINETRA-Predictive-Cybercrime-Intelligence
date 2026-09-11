import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { PredictedZone, RiskLevel } from '../types';

interface LeafletRiskMapProps {
  zones: PredictedZone[];
  activeZoneId?: string;
  onSelectZone?: (zone: PredictedZone) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export const LeafletRiskMap: React.FC<LeafletRiskMapProps> = ({
  zones,
  activeZoneId,
  onSelectZone,
  center = [13.0418, 80.2341], // Default Chennai T. Nagar
  zoom = 13,
  height = '500px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const getRiskColor = (rank: number, level: RiskLevel): { border: string; fill: string } => {
    switch (rank) {
      case 1:
        // Red ONLY for highest risk (Zone 1)
        return { border: '#DC2626', fill: '#DC2626' };
      case 2:
        // Orange for medium-high (Zone 2)
        return { border: '#F58220', fill: '#F58220' };
      case 3:
      default:
        // Yellow for moderate (Zone 3)
        return { border: '#EAB308', fill: '#EAB308' };
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center as L.LatLngTuple,
        zoom,
        zoomControl: true,
        attributionControl: false,
      });

      // Standard clean OpenStreetMap light tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      L.control
        .attribution({
          prefix: '<span class="text-[10px] text-[#5F6B76]">TRINETRA GIS Analytics • Probabilistic Risk Perimeters</span>',
        })
        .addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render zones when zones or activeZoneId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    if (zones.length === 0) return;

    zones.forEach((zone) => {
      const isSelected = zone.id === activeZoneId;
      const { border, fill } = getRiskColor(zone.rank, zone.riskLevel);

      // Probabilistic Risk Circle Perimeter (User Requirement 11)
      const circle = L.circle([zone.lat, zone.lng], {
        color: border,
        fillColor: fill,
        fillOpacity: isSelected ? 0.32 : 0.18,
        weight: isSelected ? 3 : 2,
        dashArray: isSelected ? undefined : '5, 5',
      });

      circle.on('click', () => {
        onSelectZone?.(zone);
      });

      // Interactive popup with zone data
      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; color: #172B3A; min-width: 200px; padding: 4px;">
          <div style="font-weight: 700; color: #0D4778; margin-bottom: 2px;">
            ZONE ${zone.rank}: ${zone.name}
          </div>
          <div style="font-size: 11px; color: #5F6B76; margin-bottom: 6px;">
            Risk Level: <strong>${zone.rank === 1 ? 'HIGH' : zone.rank === 2 ? 'MEDIUM-HIGH' : 'MODERATE'}</strong> • Confidence: <strong>${zone.confidencePercent}%</strong>
          </div>
          <div style="font-size: 10px; color: #5F6B76; background: #F7F9FB; padding: 4px 6px; border-radius: 4px; border: 1px solid #DCE4EA;">
            Expected Window: <strong>${zone.withdrawalWindow}</strong><br/>
            Likely Mode: <strong>${zone.likelyMode} (${zone.likelyModePercent}%)</strong>
          </div>
        </div>
      `;
      circle.bindPopup(popupContent);

      circle.addTo(layerGroup);

      // Clean Center Marker Label
      const markerHtml = `
        <div style="
          background-color: ${isSelected ? border : '#FFFFFF'};
          color: ${isSelected ? '#FFFFFF' : border};
          border: 2px solid ${border};
          border-radius: 9999px;
          padding: 2px 8px;
          font-weight: bold;
          font-size: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          white-space: nowrap;
          text-align: center;
          cursor: pointer;
        ">
          ZONE ${zone.rank}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-zone-marker',
        html: markerHtml,
        iconSize: [60, 20],
        iconAnchor: [30, 10],
      });

      const marker = L.marker([zone.lat, zone.lng], { icon: customIcon });
      marker.on('click', () => {
        onSelectZone?.(zone);
        circle.openPopup();
      });
      marker.addTo(layerGroup);
    });

    // Pan to active zone if selected
    const activeZone = zones.find((z) => z.id === activeZoneId);
    if (activeZone) {
      map.panTo([activeZone.lat, activeZone.lng]);
    }
  }, [zones, activeZoneId, onSelectZone]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="rounded-xl overflow-hidden border border-[#DCE4EA] shadow-xs"
    />
  );
};
