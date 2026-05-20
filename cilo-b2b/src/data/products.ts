export interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    weight?: string;
    featured?: boolean;
    packagingImages?: string[];
    technicalSpecs?: {
        ingredients?: string;
        nutrition?: string;
        formats?: string[];
    };
}

export const productCategories = [
    'Bañadas',
    'Clásicas',
    'Rellenas',
    'Premium',
    'Tradicionales',
];

export const products: Product[] = [
    // Bañadas
    {
        id: 'anillos-banados-300',
        name: 'Anillos Bañados',
        category: 'Bañadas',
        description: 'Deliciosos anillos bañados en chocolate. Perfectos para cualquier ocasión.',
        image: '/products/ANILL BAÑ 300.png',
        weight: '300g',
        featured: true,
        packagingImages: ['/products/3d-anillos-fuxia-2-969x1024-1.jpg'],
        technicalSpecs: {
            formats: ['Bolsa 300g', 'Caja Master 12 x 300g']
        }
    },
    {
        id: 'lenguas-banadas-300',
        name: 'Lengüitas Bañadas',
        category: 'Bañadas',
        description: 'Nuestro producto estrella. Lengüitas bañadas en chocolate.',
        image: '/products/LENG BAÑ 300.png',
        weight: '300g',
        featured: true,
    },
    {
        id: 'lenguas-vainilla-banadas-300',
        name: 'Lengüitas Vainilla Bañadas',
        category: 'Bañadas',
        description: 'Lengüitas de vainilla bañadas en chocolate.',
        image: '/products/LENG VAI BAÑ 300.png',
        weight: '300g',
    },
    {
        id: 'pepitas-banadas-300',
        name: 'Pepitas Bañadas',
        category: 'Bañadas',
        description: 'Pepitas bañadas en chocolate de primera calidad.',
        image: '/products/PEPAS BAÑ 300.png',
        weight: '300g',
    },
    {
        id: 'pepitas-semi-banadas',
        name: 'Pepitas Semi Bañadas',
        category: 'Bañadas',
        description: 'Pepitas parcialmente bañadas en chocolate.',
        image: '/products/PEPAS SEMI BAÑ.png',
    },

    // Clásicas
    {
        id: 'anillos-vainilla-200',
        name: 'Anillos de Vainilla',
        category: 'Clásicas',
        description: 'Crujientes anillos con el clásico sabor a vainilla.',
        image: '/products/ANILLOS VAIN 200 GRS.png',
        weight: '200g',
        featured: true,
        packagingImages: ['/products/anillos-vainilla-10-1024x518.jpg']
    },
    {
        id: 'anillos-limon',
        name: 'Anillos de Limón',
        category: 'Clásicas',
        description: 'Refrescantes anillos con un toque cítrico de limón.',
        image: '/products/anillos limonn.png',
        packagingImages: ['/products/anillos-limon-11.jpg'],
    },
    {
        id: 'lenguas-coco',
        name: 'Lengüitas de Coco',
        category: 'Clásicas',
        description: 'Delicadas lengüitas con el sabor tropical del coco.',
        image: '/products/LENG COCO.png',
        packagingImages: ['/products/coco-paint.jpg'],
    },
    {
        id: 'lenguas-vainilla-200',
        name: 'Lengüitas de Vainilla',
        category: 'Clásicas',
        description: 'El clásico sabor a vainilla en nuestras lengüitas.',
        image: '/products/LENG VAIN 200 GRS..png',
        weight: '200g',
        packagingImages: ['/products/lenguitas-08.jpg'],
    },
    {
        id: 'pepitas-200',
        name: 'Pepitas',
        category: 'Clásicas',
        description: 'Clásicas pepitas crujientes.',
        image: '/products/PEPAS 200 GRS..png',
        weight: '200g',
        packagingImages: ['/products/pepas-18-1.jpg'],
    },
    {
        id: 'pepitas-vegetal',
        name: 'Pepitas Vegetal',
        category: 'Clásicas',
        description: 'Pepitas elaboradas con grasa vegetal.',
        image: '/products/PEPAS VEGETAL.png',
        packagingImages: ['/products/pepa-light-14-1.jpg'],
    },

    // Rellenas
    {
        id: 'doblinas-batata',
        name: 'Doblinas de Batata',
        category: 'Rellenas',
        description: 'Crujientes galletitas rellenas con dulce de batata.',
        image: '/products/DOBLIN BATAT.png',
        packagingImages: ['/products/doblinas-13.jpg'],
    },
    {
        id: 'doblinas-membrillo',
        name: 'Doblinas de Membrillo',
        category: 'Rellenas',
        description: 'Galletitas rellenas con auténtico dulce de membrillo.',
        image: '/products/DOBLINAS MEMB.png',
        packagingImages: [
            '/products/doblinas-13.jpg'
        ],
        technicalSpecs: {
            formats: ['Fresh Pack 15 x 200g', 'Caja 12 x 400g', 'Granel x 4kg']
        }
    },
    {
        id: 'lenguas-membrillo-200',
        name: 'Lengüitas de Membrillo',
        category: 'Rellenas',
        description: 'Lengüitas rellenas con dulce de membrillo.',
        image: '/products/LENG MEMB 200 GRS..png',
        weight: '200g',
        packagingImages: ['/products/placas-web-leng-rell.jpg']
    },

    // Premium
    {
        id: 'buquitas-chocolate',
        name: 'Buquitas de Chocolate',
        category: 'Premium',
        description: 'Pequeñas delicias bañadas en chocolate de primera calidad.',
        image: '/products/BUQUITAS CHOCO.png',
        packagingImages: ['/products/placa-web-buquitas-1.jpg'],
    },
    {
        id: 'buquitas-limon',
        name: 'Buquitas de Limón',
        category: 'Premium',
        description: 'Buquitas con un refrescante sabor a limón.',
        image: '/products/BUQUITAS LIMON.png',
        packagingImages: ['/products/placa-web-buquitas-1.jpg'],
    },
    {
        id: 'chips-150',
        name: 'Chips de Chocolate',
        category: 'Premium',
        description: 'Galletas con chips de chocolate belga. Irresistibles.',
        image: '/products/CHIPS 150 GRS.png',
        weight: '150g',
        featured: true,
        packagingImages: ['/products/WEB-CHIPS-scaled.jpg'],
    },
    {
        id: 'chips',
        name: 'Chips',
        category: 'Premium',
        description: 'Deliciosas cookies con chips de chocolate.',
        image: '/products/CHIPS.png',
    },
    {
        id: 'scones',
        name: 'Scones',
        category: 'Premium',
        description: 'Scones artesanales, perfectos para el té.',
        image: '/products/SCONS.png',
        packagingImages: ['/products/Scons-paint.jpg'],
    },
    {
        id: 'surtidas',
        name: 'Surtidas',
        category: 'Premium',
        description: 'Mix de nuestras mejores galletitas. Variedad garantizada.',
        image: '/products/SURTIDAS.png',
        featured: true,
        packagingImages: ['/products/FOLLETO 1.jpg'],
    },
    {
        id: 'topings',
        name: 'Topings',
        category: 'Premium',
        description: 'Galletitas decoradas con deliciosos toppings.',
        image: '/products/TOPINGS.png',
        packagingImages: ['/products/WEB-TOPINGS-scaled.jpg'],
    },

    // Tradicionales
    {
        id: 'bizcocho-azucar',
        name: 'Bizcocho con Azúcar',
        category: 'Tradicionales',
        description: 'El clásico bizcocho argentino, ideal para el mate.',
        image: '/products/BIZCOCH AZUC.png',
        featured: true,
        packagingImages: ['/products/bizcochos-azucarados-06.jpg'],
    },
    {
        id: 'bizcocho-grasa',
        name: 'Bizcocho de Grasa',
        category: 'Tradicionales',
        description: 'Bizcocho tradicional de grasa, un sabor inconfundible.',
        image: '/products/BIZCOCH GRASA.png',
        packagingImages: ['/products/bizcochos-grasa-07.jpg'],
    },
    {
        id: 'paquete-miel',
        name: 'Paquete de Miel',
        category: 'Tradicionales',
        description: 'Galletitas con el dulce sabor de la miel.',
        image: '/products/PAQUETE MIEL.png',
        packagingImages: ['/products/WEB-MIEL-scaled.jpg'],
    },
    {
        id: 'polvoron',
        name: 'Polvorón',
        category: 'Tradicionales',
        description: 'Tradicionales polvorones que se deshacen en la boca.',
        image: '/products/POLVORON.png',
        packagingImages: ['/products/polvoron-vainilla-12.jpg'],
    },
];

export const featuredProducts = products.filter(p => p.featured);

export const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category);
};
