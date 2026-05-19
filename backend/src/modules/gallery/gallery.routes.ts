import { FastifyInstance } from "fastify";
import { getAllGallery, getGalleryById, createGallery, updateGallery, deleteGallery } from "./gallery.controller";
import { GalleryIdParam, GalleryQuerystring, CreateGalleryBody, UpdateGalleryBody } from "./gallery.interface";

export default async function galleryRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Querystring: GalleryQuerystring }>("/gallery", getAllGallery);
  app.get<{ Params: GalleryIdParam }>("/gallery/:id", getGalleryById);
  app.post<{ Body: CreateGalleryBody }>("/gallery", createGallery);
  app.put<{ Params: GalleryIdParam; Body: UpdateGalleryBody }>("/gallery/:id", updateGallery);
  app.delete<{ Params: GalleryIdParam }>("/gallery/:id", deleteGallery);
}
