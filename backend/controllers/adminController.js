exports.loginAdmin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {

            return res.json({
                success: true,
                message: "Admin Login Successful"
            });

        }

        return res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};