import models from '../../../models.js';
const { User } = models;

export const getAllUsers = async (req, res) => {
  try {
    let currentEmail = req.session?.account?.email || 
                      req.session?.account?.username || 
                      req.session?.account?.idTokenClaims?.preferred_username;
    
    let currentName = req.session?.account?.name;
    
    if (!currentEmail) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Get unique users from RaceHistory (people who have played games)
    const uniqueUsers = await req.models.RaceHistory.aggregate([
      {
        $group: {
          _id: "$username",
          username: { $first: "$username" },
          lastPlayed: { $max: "$date" },
          bestWpm: { $max: "$wpm" },
          totalRaces: { $sum: 1 }
        }
      },
      {
        $match: {
          username: { 
            $ne: currentName,          
            $ne: currentEmail,         
            $exists: true,             
            $ne: null,                 
            $not: /^guest_/,            // exclude usernames starting with "guest_"
            $regex: /@/                 
          }
        }
      },
      {
        $project: {
          _id: "$_id",                  
          username: "$username",
          email: "$username",   
          name: "$username",     
          lastPlayed: "$lastPlayed",
          bestWpm: "$bestWpm",
          totalRaces: "$totalRaces"
        }
      },
      {
        $sort: { lastPlayed: -1 }  
      }
    ]);
    
    return res.json(uniqueUsers);
  } catch (err) {
    console.error('Error in getAllUsers:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFriends = async (req, res) => {
  try {
    let email = req.session?.account?.email || 
                req.session?.account?.username || 
                req.session?.account?.idTokenClaims?.preferred_username;
                
    if (!email) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ email }).populate('friends', 'email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.friends);
  } catch (err) {
    console.error('Error fetching friends:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const inviteFriend = async (req, res) => {
  try {
    let currentEmail = req.session?.account?.email || 
                      req.session?.account?.username || 
                      req.session?.account?.idTokenClaims?.preferred_username;
                
    if (!currentEmail) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({ 
      message: 'Friend invited successfully!',
      friendEmail: req.params.targetId
    });

  } catch (err) {
    console.error('Error in inviteFriend:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};