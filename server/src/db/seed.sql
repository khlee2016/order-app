TRUNCATE order_item_options, order_items, orders, options, menus RESTART IDENTITY CASCADE;

INSERT INTO menus (id, name, description, price, image_url, stock) VALUES
  ('americano-ice', '아메리카노(ICE)', '시원하고 깔끔한 아이스 아메리카노', 4000, NULL, 10),
  ('americano-hot', '아메리카노(HOT)', '진한 에스프레소의 깊은 맛', 4000, NULL, 10),
  ('cafe-latte', '카페라떼', '부드러운 우유와 에스프레소의 조화', 5000, NULL, 10),
  ('vanilla-latte', '바닐라라떼', '달콤한 바닐라 향이 가득한 라떼', 5500, NULL, 10),
  ('caramel-macchiato', '카라멜 마키아또', '카라멜 시럽과 거품의 달콤함', 6000, NULL, 10);

INSERT INTO options (id, menu_id, name, price) VALUES
  ('extra-shot', 'americano-ice', '샷 추가', 500),
  ('extra-syrup', 'americano-ice', '시럽 추가', 0),
  ('extra-shot', 'americano-hot', '샷 추가', 500),
  ('extra-syrup', 'americano-hot', '시럽 추가', 0),
  ('extra-shot', 'cafe-latte', '샷 추가', 500),
  ('extra-syrup', 'cafe-latte', '시럽 추가', 0),
  ('extra-shot', 'vanilla-latte', '샷 추가', 500),
  ('extra-syrup', 'vanilla-latte', '시럽 추가', 0),
  ('extra-shot', 'caramel-macchiato', '샷 추가', 500),
  ('extra-syrup', 'caramel-macchiato', '시럽 추가', 0);
