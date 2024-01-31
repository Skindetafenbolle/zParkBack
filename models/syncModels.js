import Feedback from './feedback.js';
import DuplicatedFeedback from './duplicateFeedback.js';
import Subscription from './Subscription.js';

export function syncDatabaseModels() {
  Feedback.sync();
  DuplicatedFeedback.sync();
  Subscription.sync();
}
