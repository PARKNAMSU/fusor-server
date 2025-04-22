import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';

import redis from '../../shared/lib/redis';
import { FusorDynamoDB } from '../../shared/lib/dynamodb';

const dynamodb = new FusorDynamoDB(false);

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    let response: APIGatewayProxyResultV2;
    try {
        await dynamodb.initTable();

        // await dynamodb.putItem({
        //   TableName: tables.service,
        //   Item: {
        //     apiKey: { S: "asdwwqwdqwwd" },
        //     hostname: { S: "sample-hostname" },
        //     policy: {
        //       M: {
        //         role: {
        //           L: [
        //             {
        //               S: "1",
        //             },
        //           ],
        //         },
        //       },
        //     },
        //     expireAt: { N: `${Math.floor(Date.now() / 1000 + 3600)}` },
        //   },
        // });

        // interface DataType {
        //   apiKey: string;
        //   hostname: string;
        //   policy: {
        //     role: Array<string>;
        //   };
        // }

        // const data = await dynamodb.getItem<DataType>({
        //   TableName: tables.service,
        //   Key: {
        //     apiKey: {
        //       S: "asdwwqwdqwwd",
        //     },
        //   },
        // });
        // console.log(data);

        // await redis.set(
        //   "abc",
        //   JSON.stringify({
        //     id: 11,
        //     hostname: "str",
        //   }),
        //   {
        //     sync: true,
        //   },
        // );

        // const data = await redis.get<{
        //   [key: string]: any;
        // }>("abc");

        await redis.delete('abc');

        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'success',
                // data: data,
            }),
        };
    } catch (err) {
        console.trace(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err,
            }),
        };
    }

    return response;
};
