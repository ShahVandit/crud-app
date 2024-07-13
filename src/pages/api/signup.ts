import { NextApiRequest, NextApiResponse } from 'next';
import db from "@/utils/db"
import bcrypt from 'bcrypt'
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {fname, lname, password, age, email}=req.body;
        const get_command=new GetCommand({
            TableName:'users',
            Key:{
              email_id:email,
            }
          })
          const get_response=await db.docClient.send(get_command);
          if(get_response.Item) return res.status(409).json({msg:"User already exists"})
        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,salt)
    // return res.status(200);
    const command=new PutCommand({
          TableName:'users',
          Item:{
              fname, lname, email_id:email, password:hashedpassword,age,role:'user'
            }
        })
        try {
            const resp=await db.docClient.send(command);
            console.log(resp);
            res.status(200).json({msg:"Successful"});
        } catch(e){
            console.log(e)
            res.status(401).json({msg:"Server error"})
        }
  } else{
    res.status(500).json({msg:"Invalid request"});
  }
}