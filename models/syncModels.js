import Feedback from './feedback.js';
import DuplicatedFeedback from './duplicateFeedback.js';

export function syncDatabaseModels() {
  Feedback.sync();
  DuplicatedFeedback.sync();
}
