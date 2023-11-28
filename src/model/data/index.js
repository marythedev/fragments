// If the AWS_REGION env variable is set, use AWS backend services (S3, DynamoDB);
// otherwise, use an in-memory db.
module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');