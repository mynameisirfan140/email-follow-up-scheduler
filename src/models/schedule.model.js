```javascript
const { DataTypes, Model } = require('sequelize');

class Schedule extends Model {}

Schedule.init(
  {
    emailSubject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailRecipient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailSentAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reminderText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'canceled'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    timestamps: true,
    tableName: 'schedules',
    indexes: [
      {
        fields: ['emailSubject', 'emailRecipient', 'emailSentAt'],
        unique: true,
      },
    ],
  }
);

module.exports = Schedule;