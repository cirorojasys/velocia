/**
 * ================================================
 * VELOCIA — Datos del catálogo
 * ================================================
 */

import { Producto } from './models.js';

export const catalogoProductos = [
  new Producto(1, 'Trek Marlin 7', 2800000, 'img/bici1.png', 'montana',
    'La bicicleta de montaña perfecta para iniciarte en el trail. Suspensión delantera de 100mm, frenos hidráulicos y cambios Shimano Deore.',
    { Talla: 'S / M / L / XL', Material: 'Aluminio Alpha', Velocidades: '1×12', Peso: '13.8 kg' }, 'Nuevo'),

  new Producto(2, 'Specialized Stumpjumper', 8500000, 'img/SpecializedStumpjumper.webp', 'montana',
    'Full suspension de alto rendimiento. Ideal para descensos técnicos y trails exigentes. Marco de carbono ultraligero.',
    { Talla: 'S / M / L', Material: 'Carbono FACT 11m', Velocidades: '1×12 SRAM', Peso: '11.2 kg' }, 'Top'),

  new Producto(3, 'Cannondale Synapse', 4200000, 'img/cANNONDALE.WEBP', 'ruta',
    'Diseñada para cubrir grandes distancias con comodidad. Geometría endurance y componentes Shimano 105 de 11 velocidades.',
    { Talla: '48 / 51 / 54 / 58', Material: 'Aluminio SmartForm', Velocidades: '2×11 Shimano', Peso: '9.5 kg' }),

  new Producto(4, 'Giant TCR Advanced', 9800000, 'img/GIANT.jpeg', 'ruta',
    'Marco de carbono Composite de alta modularidad. La elección de ciclistas de alto rendimiento y competición.',
    { Talla: 'XS / S / M / ML', Material: 'Carbono Composite', Velocidades: '2×12 Shimano', Peso: '7.3 kg' }, 'Pro'),

  new Producto(5, 'Bianchi C-Sport', 1850000, 'img/bianchi.jpg', 'urbana',
    'Elegante y práctica para el día a día en la ciudad. 7 velocidades, guardabarros integrado y portaequipaje trasero.',
    { Talla: 'S / M / L', Material: 'Acero Cromoly', Velocidades: '1×7', Peso: '14.5 kg' }, 'Nuevo'),

  new Producto(6, 'Marin Larkspur 2', 1350000, 'img/marin.webp', 'urbana',
    'La compañera perfecta para tus trayectos urbanos. Ligera, cómoda y con excelente relación calidad-precio.',
    { Talla: 'XS / S / M / L', Material: 'Aluminio Series 6', Velocidades: '1×8', Peso: '12.8 kg' }),

  new Producto(7, 'Trek Verve+ 3', 7200000, 'img/verve.jpg', 'electrica',
    'Bicicleta eléctrica urbana con motor Bosch Performance de 250W. Hasta 120 km de autonomía. Ideal para el trabajo.',
    { Talla: 'S / M / L', Material: 'Aluminio Alpha Platinum', Motor: 'Bosch 250W', Autonomía: '~120 km' }, 'Eléctrica'),

  new Producto(8, 'Specialized Turbo Vado', 11500000, 'img/vado2.jpg', 'electrica',
    'La e-bike más avanzada para uso diario. Motor SL 1.1 con 240W y batería de 320Wh integrada en el tubo inferior.',
    { Talla: 'M / L / XL', Material: 'Aluminio E5', Motor: 'Specialized SL 1.1 240W', Autonomía: '~150 km' }, 'Top'),

  new Producto(9, 'Giant ARX 24', 850000, 'img/arx24.webp', 'infantil',
    'Diseñada para niños de 7 a 10 años. Ligera, con frenos de fácil accionamiento y componentes dimensionados a su tamaño.',
    { Talla: '24 pulgadas', Material: 'Aluminio', Velocidades: '1×6', Peso: '9.2 kg' }),

  new Producto(10, 'Trek Precaliber 20', 780000, 'img/precaliber.png', 'infantil',
    'La primera bicicleta real para pequeños aventureros. Con ruedas de entrenamiento opcionales y frenos seguros.',
    { Talla: '20 pulgadas', Material: 'Acero', Velocidades: '1×6', Peso: '8.5 kg' }, 'Nuevo'),

  new Producto(11, 'Scott Scale 940', 3600000, 'img/Scale940.webp', 'montana',
    'Hardtail de trail con componentes de nivel medio-alto. Horquilla RockShox Judy Gold y frenos Shimano MT400.',
    { Talla: 'XS / S / M / L / XL', Material: 'Aluminio 6061', Velocidades: '1×12', Peso: '12.7 kg' }),

  new Producto(12, 'Orbea Gain M30', 6500000, 'img/orbea.jpg', 'electrica',
    'E-road bike ligera con motor integrado casi invisible. La mejor opción para ciclistas de ruta que quieren un empujón.',
    { Talla: '47 / 51 / 55', Material: 'Aluminio Hydroformed', Motor: 'Mahle X35+ 250W', Autonomía: '~100 km' }),
];
