const Service = require('../models/Service');
const { ErrorResponse } = require('../utils/errorHandler');
const { createAuditLog } = require('../utils/auditLogger');

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
    try {
        const { category, search } = req.query;

        const query = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Service.countDocuments(query);

        const services = await Service.find(query)
            .populate('providerId', 'name email phone')
            .skip(startIndex)
            .limit(limit);

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }

        res.status(200).json({
            success: true,
            count: services.length,
            total,
            pagination,
            data: services,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id).populate(
            'providerId',
            'name email phone'
        );

        if (!service) {
            return next(new ErrorResponse('Service not found', 404));
        }

        res.status(200).json({
            success: true,
            data: service,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private (Provider only)
const createService = async (req, res, next) => {
    try {
        const { name, description, category, duration } = req.body;

        const service = await Service.create({
            name,
            description,
            category,
            duration,
            providerId: req.user._id,
        });

        // Create audit log
        await createAuditLog(
            req.user._id,
            'SERVICE_CREATE',
            'Service',
            service._id,
            `Service created: ${service.name}`,
            req.ip
        );

        res.status(201).json({
            success: true,
            data: service,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Provider only, own services)
const updateService = async (req, res, next) => {
    try {
        let service = await Service.findById(req.params.id);

        if (!service) {
            return next(new ErrorResponse('Service not found', 404));
        }

        // Check ownership
        if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to update this service', 403));
        }

        const { name, description, category, duration, isActive } = req.body;

        const fieldsToUpdate = {};
        if (name !== undefined) fieldsToUpdate.name = name;
        if (description !== undefined) fieldsToUpdate.description = description;
        if (category !== undefined) fieldsToUpdate.category = category;
        if (duration !== undefined) fieldsToUpdate.duration = duration;
        if (isActive !== undefined) fieldsToUpdate.isActive = isActive;

        service = await Service.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        });

        // Create audit log
        await createAuditLog(
            req.user._id,
            'SERVICE_UPDATE',
            'Service',
            service._id,
            `Service updated: ${service.name}`,
            req.ip
        );

        res.status(200).json({
            success: true,
            data: service,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Provider only, own services)
const deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return next(new ErrorResponse('Service not found', 404));
        }

        // Check ownership
        if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to delete this service', 403));
        }

        await service.deleteOne();

        // Create audit log
        await createAuditLog(
            req.user._id,
            'SERVICE_DELETE',
            'Service',
            service._id,
            `Service deleted: ${service.name}`,
            req.ip
        );

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get provider's services
// @route   GET /api/services/provider/my-services
// @access  Private (Provider only)
const getMyServices = async (req, res, next) => {
    try {
        const services = await Service.find({ providerId: req.user._id });

        res.status(200).json({
            success: true,
            count: services.length,
            data: services,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
    getMyServices,
};
