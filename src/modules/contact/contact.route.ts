import express from 'express';
import { contactController } from './contact.controler';

const contactRouter = express.Router();

contactRouter.post('/', contactController.createContact);

export default contactRouter;
