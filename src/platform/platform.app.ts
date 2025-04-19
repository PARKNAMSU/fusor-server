import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResultV2> => {
  let response: APIGatewayProxyResultV2;
  try {
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "",
      }),
    };
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: "some error happened",
      }),
    };
  }

  return response;
};
