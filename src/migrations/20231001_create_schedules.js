```javascript
/**
 * Database migration script to create the schedules table with required columns and constraints.
 * Uses Sequelize migration API.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      emailSubject: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      emailRecipient: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      sentAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      reminderText: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      scheduledAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('pending', 'completed'),
        defaultValue: 'pending',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // Indexes for common query patterns
    await queryInterface.createIndex('schedules', ['emailSubject', 'emailRecipient'], {
      name: 'idx_schedules_subject_recipient',
    });
    await queryInterface.createIndex('schedules', ['scheduledAt'], {
      name: 'idx_schedules_scheduled_at',
    });
    await queryInterface.createIndex('schedules', ['status'], {
      name: 'idx_schedules_status',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('schedules', { cascade: true });
  },
};
```