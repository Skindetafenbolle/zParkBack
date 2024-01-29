import { Op } from 'sequelize';
import feedbackModel  from '../models/feedback.js';


const isPhoneNumberDuplicate = async (phoneNumber) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const count = await feedbackModel.Feedback.count({
    where: {
      number: phoneNumber,
      date: {
        [Op.between]: [firstDayOfMonth, today],
      },
    },
  });

  return count >= 2;
};

export default isPhoneNumberDuplicate;
