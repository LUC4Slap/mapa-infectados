// Estilos personalizados para o Google Maps
// Adicione estes estilos em src/app/pages/home/home.ts na propriedade mapOptions.styles

// Tema Escuro
export const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }]
  }
];

// Tema Claro Minimalista
export const lightMapStyle = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "on" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e9e9e9" }]
  }
];

// Tema Retro
export const retroMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#c9c9c9" }]
  }
];

// Como usar:
// No arquivo home.ts, importe o estilo e adicione em mapOptions:
// 
// import { darkMapStyle } from './map-styles';
// 
// mapOptions: google.maps.MapOptions = {
//   ...
//   styles: darkMapStyle  // ou lightMapStyle, retroMapStyle
// };
