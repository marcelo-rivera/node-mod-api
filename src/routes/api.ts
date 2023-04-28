import { Router } from 'express';
import multer from 'multer';

import * as ApiController from '../controllers/apiController';

const upload = multer({
    dest: './tmp'
});

const router = Router();

router.get('/ping', ApiController.ping);
router.get('/random',ApiController.random);
router.get('/nome/:nome', ApiController.nome);
router.get('/frases/aleatoria',ApiController.randomPhrase);

router.post('/frases', ApiController.createPhrase);
router.get('/frases', ApiController.listPhrases);
router.get('/frases/:id', ApiController.getPhrase);
router.put('/frases/:id',ApiController.updatePhrase);
router.delete('/frases/:id',ApiController.deletePhrase);

router.post('/upload', upload.single('avatar'), ApiController.uploadFile);

export default router;