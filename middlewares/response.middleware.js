const responseMiddleware = (req, res, next) => {
    if (res.data) {
        res.send(res.data);
    } else {
        res.status(res.err.status).send(getErrorObject(res.err.message));
    }
    next();
};

const getErrorObject = (message) => {
    return {
        error: true,
        message
    };
};

class ResponseError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

exports.responseMiddleware = responseMiddleware;
exports.ResponseError = ResponseError;