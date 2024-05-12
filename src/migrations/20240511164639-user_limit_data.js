'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      INSERT INTO limits ("id", "requestAmount", "isDefault", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 20, true, NOW(), NOW());
    `);
    await queryInterface.sequelize.query(`
      DO $$
      DECLARE limit_id UUID;
      DECLARE request_amount INTEGER;
      BEGIN
      limit_id := (select id from limits where "isDefault" = true limit 1);
      request_amount := (select "requestAmount" from limits where "isDefault" = true limit 1);
      insert into user_limits ("id", "requestAmount", "userId", "limitId", "createdAt", "updatedAt")
      select gen_random_uuid(), request_amount, u."id", limit_id, NOW(), NOW()
      from users u;
      END $$;
    `);
  },

  async down(queryInterface, Sequelize) {},
};
