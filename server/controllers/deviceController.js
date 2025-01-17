const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models.js");
const ApiError = require("../error/ApiError.js");

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let filename = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", filename));

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: filename,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((inf) => {
          DeviceInfo.create({
            title: inf.title,
            description: inf.description,
            deviceId: device.id,
          });
        });
      }

      return res.json(device);
    } catch (err) {
      next(ApiError.badRequest(err.message));
    }
  }
  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    const offset = (page - 1) * limit;
    let devices;
    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset });
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      });
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      });
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId, typeId },
        limit,
        offset,
      });
    }

    return res.json(devices);
  }
  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      includes: [{ model: DeviceInfo, as: "info" }],
    });
    return res.json(device);
  }
}

module.exports = new DeviceController();
