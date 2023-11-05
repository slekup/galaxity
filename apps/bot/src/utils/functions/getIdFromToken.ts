/**
 * Gets the ID from a bot token.
 * @param token The bot token to get the ID from.
 * @returns The ID of the user.
 */
const getIdFromToken = (token: string): string => {
  const parseUser = token.split('.')[0];
  if (!parseUser)
    throw new Error('Invalid token. Could not get ID from token.');
  const buff = Buffer.from(parseUser, 'base64');
  const userid = buff.toString('utf-8');
  return userid;
};

export default getIdFromToken;
