import AWS, {DynamoDB} from "aws-sdk"
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"

const client=new DynamoDBClient({
    region:process.env.REGION,
    credentials:{
        accessKeyId:process.env.ACCESS_KEY as string,
        secretAccessKey:process.env.ACCESS_KEY_SECRET as string,
    
    }
})

const docClient=DynamoDBDocumentClient.from(client)

export default{docClient}