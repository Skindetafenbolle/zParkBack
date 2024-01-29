import { Op } from "sequelize";
import Feedback from "./models/feedback.js";
import DuplicatedFeedback from "./models/duplicateFeedback.js";
import { startOfMonth, isAfter, parseISO } from "date-fns";


export const adminJsOptions = {
    assets: {
        styles: ["/sidebar.css"],
    },
    branding: {
      companyName: 'Zpark dashboard',
      softwareBrothers: false, 
      logo: 'https://nimble-lollipop-df2fcd.netlify.app/img/logo-removebg-cut.png',
    },
    resources: [
        {
            resource: Feedback,
            options: {
                properties: {
                    name: { isVisible: { list: true, show: true, edit: true, filter: true } },
                    date: { isVisible: { list: true, show: true, edit: true, filter: true } },
                    name_kid: { isVisible: { list: true, show: true, edit: true, filter: true } },
                    age_kid: { isVisible: { list: true, show: true, edit: true, filter: true } },
                    count_kid: { isVisible: { list: true, show: true, edit: true, filter: true } },
                    number: { isVisible: { list: true, show: true, edit: true, filter: true } },
                    isOpen: { isVisible: { list: true, show: true, edit: true } },
                    formSource: { isVisible: { list: true, show: true, edit: true, filter: true } },
                    id: { isVisible: false },
                    updatedAt: { isVisible: false },
                },
                actions: {
                    show: {
                        after: async (response, request, context) => {
                            const record = context.record;
                            if (record.params.isOpen === false) {
                                await record.update({ isOpen: true });
                                console.log(`Поле isOpen для записи с ID ${record.param('id')} обновлено на true`);
                            }
  
                            return {
                                record: record.toJSON(context.currentAdmin),
                            };
                        },
                    },
                },
                parent: {
                  name: 'Zpark',
                },
            },  
        },
        {
          resource: DuplicatedFeedback,
          options: {
            properties: {
              name: { isVisible: true },
              date: { isVisible: true },
              name_kid: { isVisible: true },
              age_kid: { isVisible: true },
              count_kid: { isVisible: true },
              number: { isVisible: true },
              isOpen: { isVisible: true },
              formSource: { isVisible: true },
              id: { isVisible: false },
            },
            actions: {
              show: {
                  after: async (response, request, context) => {
                      const record = context.record;
                      if (record.params.isOpen === false) {
                          await record.update({ isOpen: true });
                          console.log(`Поле isOpen для записи с ID ${record.param('id')} обновлено на true`);
                      }
  
                      return {
                          record: record.toJSON(context.currentAdmin),
                      };
                  },
              },
          },
          parent: {
            name: 'Zpark',
          },
          },
        },
    ],
    rootPath: '/admin',
  };