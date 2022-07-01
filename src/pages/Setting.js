import styles from '../styles/settings.module.css';
import { useAuth } from '../hooks';
import { useState } from 'react';
import { useToasts } from 'react-toast-notifications';

const Setting = () => {
  const auth = useAuth();
  const [editMood, setEditMood] = useState(false);
  const [name, setName] = useState(auth.user?.email ? auth.user.name : '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingForm, setSavingForm] = useState(false);
  const { addToast } = useToasts();

  const clearForm = () => {
    setPassword('');
    setConfirmPassword('');
  };

  const updateProfile = async () => {
    setSavingForm(true);
    let error = false;
    if (!name || !password || !confirmPassword) {
      addToast('Please fill all the fields', {
        appearance: 'error',
      });
      error = true;
    }

    if (password !== confirmPassword) {
      addToast('Password and confirm password dose not match', {
        appearance: 'error',
      });
      error = true;
    }

    if (error) {
        return setSavingForm(false);
    }

    const response = await auth.updateUser(
      auth.user._id,
      name,
      password,
      confirmPassword
    );

    // console.log('settings response', response);

    if (response.success) {
      setEditMood(false);
      setSavingForm(false);
      clearForm();
      return addToast('User update successfully', {
        appearance: 'success',
      });
    } else {
      addToast(response.message, {
        appearance: 'error',
      });
    }
    setSavingForm(false);
  };

  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt=""
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Email</div>
        <div className={styles.fieldValue}>{auth.user?.email}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>
        {editMood === true ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <div className={styles.fieldValue}>{auth.user?.name}</div>
        )}
      </div>

      {editMood === true && (
        <>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.fieldLabel}>Confirm Password</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </>
      )}

      {editMood === false ? (
        <div className={styles.btnGrp}>
          <button
            className={`button ${styles.editBtn}`}
            onClick={() => setEditMood(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className={styles.btnGrp}>
          <button
            className={`button ${styles.saveBtn}`}
            onClick={updateProfile}
            disabled={savingForm}
          >
            {savingForm ? 'Saving Profile...' : 'Save Profile'}
          </button>
          <button
            className={`button ${styles.editBtn}`}
            onClick={() => setEditMood(false)}
          >
            GO Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Setting;
