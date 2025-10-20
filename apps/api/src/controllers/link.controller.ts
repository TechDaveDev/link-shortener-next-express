import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { nanoid } from 'nanoid';

export const createLink = async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL es requerida' });
  }

  try {
    const existingLink = await prisma.link.findUnique({
      where: {
        url: url,
      },
    });

    if (existingLink) {
      return res.status(200).json(existingLink);
    }

    const shortCode = nanoid(7);
    const newLink = await prisma.link.create({
      data: {
        url,
        shortCode,
      },
    });

    res.status(201).json(newLink);

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

export const getAllLinks = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string || '';

  const skip = (page - 1) * limit;

  try {
    const whereCondition = search
      ? {
        OR: [
          { url: { contains: search } },
          { shortCode: { contains: search } },
        ],
      }
      : {};

    const [links, total] = await prisma.$transaction([
      prisma.link.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.link.count({ where: whereCondition }),
    ]);

    res.status(200).json({
      data: links,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los enlaces' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const [totalLinks, totalClicks] = await prisma.$transaction([
      prisma.link.count(),
      prisma.link.aggregate({
        _sum: {
          clicks: true,
        },
      }),
    ]);

    res.status(200).json({
      totalLinks,
      totalClicks: totalClicks._sum.clicks || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las estadísticas' });
  }
};
