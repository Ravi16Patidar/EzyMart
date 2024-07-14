import UserModel from "../models/UserModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res) => {
    try {
        const {password,...restData}=req.body;
        let hashPassword = await bcrypt.hash(password, 10);
        const userData ={
            ...restData,
            password:hashPassword,
        }
        let result=await UserModel.create(userData)
        res.status(201).json({
            data:result,
            message:"Signup successfully",
            status:201,
        })
    } catch (err) {
        res.status(500).json({
            message:"Something went wrong",
            status:500,
            error:err
        })
        
    }
};


export const login = async (req, res) => {
    try{
        const {email,password}=req.body;
        let userData=await UserModel.findOne({email})
        if(userData){
            bcrypt.compare(password, userData.password, function(err, result) {
                if(result){
                    let payload={userData};
                    let token=jwt.sign(payload,process.env.SECREAT_KEY)
                    res.cookie('token', token)
                    res.status(200).json({
                        message:"login successfully",
                        status:200,
                    })
                }
                else{
                    res.status(400).json({
                        message:"password Incorrect",
                        status:400,
                    })
                }
            });
        }else{
            res.status(400).json({
                message:"user not found",
                status:400,
            })
        }
    }catch(err){
        res.status(500).json({
            message:"Something went wrong",
            status:500,
            error:err
        })
    }
};
