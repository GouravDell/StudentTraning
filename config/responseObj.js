exports.responseObj = {
    login: {
        status: true,
        message: "User login successfully",
        statusCode: 200,
    },
    signup: {
        status: true,
        message: "user register successfully",
        statusCode: 200
    },
    get: {
        status: true,
        message: "data get successfully",
        statusCode: 200
    },
    create: {
        status: true,
        message: "product created successfully",
        statusCode: 201
    },
    data_not_found: {
        status: false,
        message: "data not found",
        statusCode: 404
    },
    delete_data: {
        status: true,
        message: "product delete successfully",
        statusCode: 200
    },
    get_product: {
        status: true,
        message: "product get successfully",
        statusCode: 200
    },
    update_product: {
        status: true,
        message: "product update successfully",
        statusCode: 200
    },
    add_product: {
        status: false,
        message: "please add field",
        statusCode: 404
    },
    not_found: {
        message: "Product not found",
    },
    Please_Enter_Email_Name_Password: "Please enter name,email,password",
    User_not_found: "user not found",
    Invalid_Credentials: ".Invalid_Credentials",

    create_course: {
        status: true,
        message: "Course created successfully",
        statusCode: 201,
    },

    get_courses: {
        status: true,
        message: "Courses fetched successfully",
        statusCode: 200,
    },

    update_course: {
        status: true,
        message: "Course updated successfully",
        statusCode: 200,
    },

    delete_course: {
        status: true,
        message: "Course deleted successfully",
        statusCode: 200,
    },


}