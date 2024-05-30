"use strict";

class BaseController {
  constructor(Model) {
    if (!Model) {
      throw new Error("Missing mandatory property Model");
    }

    this.Model = Model;
  }

  index = async (req, res, next) => {
    try {
      return res.apiOK(
        "Entities successfully retrieved",
        await this.Model.findAll({})
      );
    } catch (e) {
      next(e);
    }
  };

  show = async (req, res, next) => {
    try {
      const entity = await this.Model.findById(req.params.id);

      if (!entity) {
        return res.apiNotFound("Entity not found!");
      }

      return res.apiOK("Entities successfully retrieved", entity);
    } catch (e) {
      next(e);
    }
  };

  create = async (req, res, next) => {
    try {
      const createColumns = this.Model.columns.filter(
        (c) => !["id", "created_at", "updated_at"].includes(c)
      );
      const createData = {};

      createColumns.forEach((col) => {
        if (req.body[col]) {
          createData[col] = req.body[col];
        }
      });

      const result = await this.Model.create({ ...createData });

      const entity = await this.Model.findById(result[0]);

      return res.apiCreated("Entity successfully created", entity);
    } catch (e) {
      next(e);
    }
  };

  update = async (req, res, next) => {
    try {
      if (
        parseInt(req.params.id) ||
        !(await this.Model.findById(req.params.id))
      ) {
        return res.apiNotFound("Entity not found!");
      }

      const updateColumns = this.Model.columns.filter(
        (c) => !["id", "created_at", "updated_at"].includes(c)
      );
      const updateData = {};

      updateColumns.forEach((col) => {
        if (req.body[col]) {
          updateData[col] = req.body[col];
        }
      });

      await this.Model.update({ ...updateData }, { id: req.params.id });

      return res.apiOK(
        "Entity successfully updated",
        await this.Model.findById(req.params.id)
      );
    } catch (e) {
      next(e);
    }
  };

  delete = async (req, res, next) => {
    try {
      if (
        parseInt(req.params.id) ||
        !(await this.Model.findById(req.params.id))
      ) {
        return res.apiNotFound("Entity not found!");
      }

      await this.Model.deleteById(req.params.id);

      return res.apiDeleted("Entity deleted!");
    } catch (e) {
      next(e);
    }
  };
}

module.exports = BaseController;
