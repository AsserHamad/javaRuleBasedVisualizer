class InternalServerError extends BaseError {
    constructor(error) {
            super(error || "Internal Server Error! 5omsomeyaaa", 500);
    }
}

module.exports = InternalServerError;