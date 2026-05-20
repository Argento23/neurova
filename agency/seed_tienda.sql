-- ============================================================================
-- SEED DATA: PRODUCTOS DE MUESTRA PARA EMPRENDEDOR SOLIDARIO
-- ============================================================================

-- 1. Crear un emprendedor de sistema para las muestras (o usá tu ID si ya te registraste)
-- Nota: Si querés que estos productos aparezcan en TU panel, reemplazá este UUID por el tuyo.
INSERT INTO entrepreneurs (clerk_user_id, business_name, whatsapp_number, description, status)
VALUES ('system_admin', 'Tienda Demo', '5491112345678', 'Productos de muestra del sistema.', 'active')
ON CONFLICT (clerk_user_id) DO UPDATE SET business_name = EXCLUDED.business_name;

-- 2. Obtener el ID del emprendedor de sistema
DO $$
DECLARE
    sys_id UUID;
BEGIN
    SELECT id INTO sys_id FROM entrepreneurs WHERE clerk_user_id = 'system_admin' LIMIT 1;

    -- 3. Insertar los productos de muestra
    INSERT INTO products (entrepreneur_id, name, price, category, image_url, description)
    VALUES 
    (sys_id, 'Mermelada Artesanal de Frutos Rojos', 2500, 'Alimentos', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop', 'Elaborada con frutas de estación, sin conservantes. Frasco de 350g.'),
    (sys_id, 'Velas de Soja Aromáticas', 1800, 'Hogar', 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=300&fit=crop', 'Velas artesanales de cera de soja con aceites esenciales naturales.'),
    (sys_id, 'Bolso Tejido a Mano', 6500, 'Moda', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop', 'Bolso crochet con hilo de algodón 100%. Colores personalizables.'),
    (sys_id, 'Jabones Naturales x3', 2200, 'Cuidado Personal', 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400&h=300&fit=crop', 'Pack de 3 jabones artesanales: lavanda, avena y menta. Sin parabenos.'),
    (sys_id, 'Miel Orgánica 500g', 3200, 'Alimentos', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop', 'Miel pura de apiarios propios. Certificación orgánica.'),
    (sys_id, 'Macetas de Cemento Pintadas', 1500, 'Hogar', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop', 'Macetas artesanales pintadas a mano. Ideales para suculentas.'),
    (sys_id, 'Remera Estampada Serigrafía', 4500, 'Moda', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop', 'Remera 100% algodón con serigrafía artesanal. Diseños únicos.'),
    (sys_id, 'Granola Casera Mix Tropical', 1900, 'Alimentos', 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?w=400&h=300&fit=crop', 'Granola con avena, coco, almendras y frutas deshidratadas. 400g.'),
    (sys_id, 'Agenda Artesanal 2026', 3800, 'Accesorios', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop', 'Encuadernación artesanal cosida, tapas de cartón reciclado, 200 hojas.');
END $$;
