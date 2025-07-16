import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    object: 'list',
    data: [
      {
        id: 'jiutian-lan',
        object: 'model',
        created: 1725500000,
        owned_by: 'jiutian',
        permission: [],
      },
    ],
  });
}
