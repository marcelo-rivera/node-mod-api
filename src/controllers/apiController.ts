import { unlink } from 'fs/promises';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import sharp from 'sharp';
import {Phrase } from '../models/Phrase';

export const ping = (req: Request, res: Response) => {
    res.json({pong: true});
}

export const random =  (req: Request, res: Response) => {
    let nRand: number = Math.floor(Math.random() * 100);
    res.json({number: nRand})
}

export const nome =  (req: Request, res: Response) => {
    let nome: string = req.params.nome;
    res.json({nome: `Você enviou o nome ${nome}`});
}

export const createPhrase = async (req:Request, res: Response) => {
    //let author: string = req.body.author;
    //let txt: string = req.body.txt;    ou
    let {author, txt} = req.body;

    let newPhrase = await Phrase.create({ author, txt });

    res.json({id: newPhrase.id, author, txt});
}

export const listPhrases = async (req:Request, res: Response) => {
    let list = await Phrase.findAll();

    res.json({list});
}

export const getPhrase = async (req:Request, res: Response) => {
    let phrase = await Phrase.findByPk(req.params.id);
    if(phrase){
        res.json({phrase});
    }else {
        res.json({error: 'Frase não encontrada'});
    }
}

export const updatePhrase = async (req:Request, res: Response) => {
    let phrase = await Phrase.findByPk(req.params.id);
    let { author, txt } = req.body;

    if(phrase){
        phrase.author = author;
        phrase.txt = txt;
        await phrase.save();

        res.json({phrase});
    }else {
        res.json({error: 'Frase não encontrada'});
    }
}

export const deletePhrase = async (req:Request, res: Response) => {
    let phrase = await Phrase.destroy({
        where:{
            id: req.params.id
        }
    });
    res.json({phrase});
}

export const randomPhrase = async (req:Request, res: Response) => {
    let phrase = await Phrase.findOne({
        order: [
            Sequelize.fn('RANDOM')  // NO MYSQL => RAND
        ]
    });
    if(phrase){
    res.json({phrase});
    }else{
        res.json({error: 'Não há frases cadastradas !'});
    }
}

export const uploadFile = async (req: Request, res: Response) => {
   /* const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // somente para tipo fields ou
    //type UploadTypes = {
    //    avatar: Express.Multer.File[],
    //    gallery: Express.Multer.File[]
    //}
    //const files = req.files as UploadTypes;  // ou
        
    const files = req.files as {
            avatar: Express.Multer.File[],
            gallery: Express.Multer.File[]
        }

    console.log("avatar", files.avatar);
    console.log("gallery", files.gallery); */

    //console.log(req.file);
    //console.log(req.files);

    if (req.file){

        const filename = `${req.file.filename}.jpg`;

        await sharp(req.file.path)
            .resize(500)
            .toFormat('jpeg')
            .toFile(`./public/media/${filename}`);

        await unlink(req.file.path);  //excluir arquivo temporario

        res.json({ìmage: `${filename}`});
    }else {
        res.status(400);
        res.json({error: 'Arquivo invalido'});
    }

}