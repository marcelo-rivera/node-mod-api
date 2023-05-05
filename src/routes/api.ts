import { Router } from 'express';
import multer from 'multer';

import * as ApiController from '../controllers/apiController';

const storageConfig = multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, './tmp');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname+Date.now()}.jpg`);
    }
});

const upload = multer({
    storage: storageConfig,
    fileFilter: (req, file, cb) => {
        const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];

        /*if(allowed.includes(file.mimetype)){
            cb(null,true);
        }else{
        cb(null, false);
        }*/              // ou melhorando o codigo
        cb(null,allowed.includes(file.mimetype));
    },
    limits: {fieldSize: 20000000}           /// tamanhop do arquivo em bytes
});                              // ou simplesmente as 3 linhas abaixo

/*const upload = multer({
    dest: './tmp'
});*/

//const upload = multer({
//    storage: multer.memoryStorage()   // o arquivo vai ficar na memoria
//});



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

router.post('/upload', upload.single('avatar'), ApiController.uploadFile);   //arquivo unico de 1 tipo
//router.post('/upload', upload.array('avatars',2), ApiController.uploadFile); //"2" arquivos de 1 tipo
/*router.post('/upload', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'gallery', maxCount: 3 }
]), ApiController.uploadFile); */ //tipos definidos

export default router;