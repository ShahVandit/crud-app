import { NextApiRequest, NextApiResponse } from 'next';
import db from "@/utils/db"
import bcrypt from "bcrypt"
import { serialize } from 'cookie';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {username,password}=req.body;
    const command=new GetCommand({
      TableName:'users',
      Key:{
        email_id:username,
      }
    })
  try {

    const response=await db.docClient.send(command);
    if(!response.Item){
      return res.status(404).json({msg:"User not found"})
    }
    const role=response.Item.role
    const user=await bcrypt.compare(password,response.Item.password)
    if(user){
      const secret=process.env.JWT_KEY
      const token= jwt.sign({username},secret as string,{expiresIn:'1d'})
      const user={username,role:response.Item.role}
      const command=new UpdateCommand({
        TableName:'users',
        Key:{ email_id:username },
        UpdateExpression: 'set #token= :token',
        ExpressionAttributeNames:{'#token':'token'},
        ExpressionAttributeValues:{ ':token':token}
      })

      const update_table=await db.docClient.send(command);
      if(update_table.$metadata.httpStatusCode===200){
        return res.status(200).json({token, user})
      } else{
        return res.status(403).json({msg:"Token issue"})
      }
      
      // cookies().set
      // const token = jwt.sign({username, password}, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

    }  
    res.status(401).json({msg:"Incorrect password"})
    } catch(e){
      console.log(e)
      res.status(405).json({msg:"Fetch problem"})
    }
  } else{
    res.status(500).json({msg:"Invalid request"});
  }
}