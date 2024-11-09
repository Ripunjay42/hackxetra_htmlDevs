// Import functions from eventService
import selectAllService from '../services/eventService';
import { createEvent as createEventService } from '../services/eventService';

const selectAllEvent = async (req, res) => {
    return await selectAllService(req, res); // Calls the function from eventService
}

const createEventHandler = async (req, res) => {
    return await createEventService(req, res); // Calls the function from eventService
}

// Export the locally defined functions
export { selectAllEvent, createEventHandler as createEvent };
