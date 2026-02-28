import multer from 'multer';

export class ErrorHandler {
    
    handleError = (err, req, res, next) => {
        
        if (this._isFileTooLarge(err)) {
            return this._sendResponse(res, 413, "File too large");
        }

        if (this._isMulterError(err)) {
            return this._sendResponse(res, 400, err.message);
        }

        if (this._isInvalidFileType(err)) {
            return this._sendResponse(res, 400, "Invalid file type");
        }

        if (this._isCustomError(err)) {
            return this._sendResponse(res, err.status, err.message);
        }

        return this._sendUnhandledError(err, res);
    };


    _isFileTooLarge(err) {
        return err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE';
    }

    _isMulterError(err) {
        return err instanceof multer.MulterError;
    }

    _isInvalidFileType(err) {
        return err.message === 'Invalid file type';
    }

    _isCustomError(err) {
        return err.status !== undefined;
    }


    _sendResponse(res, status, message) {
        return res.status(status).json({ error: message });
    }

    _sendUnhandledError(err, res) {
        console.error("Unhandled Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const errorHandlerInstance = new ErrorHandler();
export const globalErrorHandler = errorHandlerInstance.handleError;