class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        error=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
        this.error=error

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this, this.constructor) //if not manually given it show which file have error in which lines
        }
    }
}

export default ApiError