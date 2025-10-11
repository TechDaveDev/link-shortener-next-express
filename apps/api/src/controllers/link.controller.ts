import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { nanoid } from 'nanoid';

export const createLink = async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL es requerida' });
  }

  try {
    const shortCode = nanoid(7);

    const newLink = await prisma.link.create({
      data: {
        url,
        shortCode,
      },
    });

    const shortUrl = `http://localhost:${process.env.PORT || 3001}/${newLink.shortCode}`;

    res.status(201).json({
      ...newLink,
      shortUrl,
    });

  } catch (error) {
    console.error("Error al crear el enlace:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const redirectToUrl = async (req: Request, res: Response) => {
  const { shortCode } = req.params;

  try {
    const link = await prisma.link.findUnique({
      where: {
        shortCode,
      },
    });

    if (!link) {
      return res.status(404).json({ error: 'URL no encontrada' });
    }

    await prisma.link.update({
      where: {
        shortCode,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });

    return res.redirect(301, link.url);

  } catch (error) {
    console.error(`Error al redirigir ${shortCode}:`, error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
