import styles from '../styles/settings.module.css';
import { useAuth } from '../hooks';
import { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useParams, useNavigate } from 'react-router-dom';
import { addFriend, fetchUserProfile, removeFriend } from '../api';
import Loader from '../components/Loader';
const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [requestInProgress, setRequestInProgress] = useState(false);

  // const [requestInProgress,setrequestInProgress] = useState(false)
  const { userId } = useParams();
  const auth = useAuth();
  // const location = useLocation();
  const { addToast } = useToasts();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const response = await fetchUserProfile(userId);
      if (response.success) {
        setUser(response.data.user);
      } else {
        addToast(response.message, {
          appearance: 'error',
        });
        navigate('/');
      }
      setLoading(false);
    };
    getUser();
  }, [userId]);

  if (loading) {
    return <Loader />;
  }

  const checkIfUserIsAFriend = () => {
    const friends = auth.user.friends;
    console.log(auth.user);
    const fiendIds = friends.map((friend) => friend.to_user._id);
    const index = fiendIds.indexOf(userId);
    if (index !== -1) {
      return true;
    }
    return false;
  };

  const handleAddFriendClick = async () => {
    setRequestInProgress(true);

    const response = await addFriend(userId);
    if (response.success) {
      const { friendship } = response.data;
      auth.updateUserFriend(true, friendship);
      addToast('Friend added suceessfully', {
        appearance: 'success',
      });
    } else {
      addToast(response.message, {
        appearance: 'error',
      });
    }
    setRequestInProgress(false);
  };

  const handleRemoveFriendClick = async () => {
    setRequestInProgress(true);

    const response = await removeFriend(userId);
    if (response.success) {
      const friendship = auth.user.friends.filter(
        (friend) => friend.to_user._id === userId
      );

      auth.updateUserFriend(false, friendship[0]);
      addToast('Friend removed suceessfully', {
        appearance: 'success',
      });
    } else {
      addToast(response.message, {
        appearance: 'error',
      });
    }
    setRequestInProgress(false);
  };

  // const showAddFriendBtn = checkIfUserIsAFriend();
  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src="https://cdn-icons.flaticon.com/png/512/1144/premium/1144709.png?token=exp=1655284902~hmac=90151159f21885c800762b6bf7bac98b"
          alt=""
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Email</div>
        <div className={styles.fieldValue}>{user.email}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>

        <div className={styles.fieldValue}>{user.name}</div>
      </div>

      <div className={styles.btnGrp}>
        {checkIfUserIsAFriend() ? (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleRemoveFriendClick}
          >
            {requestInProgress ? 'Removing friend...' : 'Remove friend'}
          </button>
        ) : (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleAddFriendClick}
            disabled={requestInProgress}
          >
            {requestInProgress ? 'Adding friend...' : 'Add friend'}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
