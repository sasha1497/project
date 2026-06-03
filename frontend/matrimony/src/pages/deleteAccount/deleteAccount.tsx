import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDeleteUserAccountMutation } from '../../features/deleteaccount/deleteAccountApi';
import { logout } from '../../features/auth/authSlice';
import { clearClientStorage } from '../../utils/clientStorage';
import './deleteAccount.css';

const getStoredUserId = () => {
  try {
    const storedUser = localStorage.getItem('authUser');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    return parsedUser?.id;
  } catch {
    return null;
  }
};

const DeleteAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteUserAccount, { isLoading }] = useDeleteUserAccountMutation();
  const authUserId = useSelector((state: any) => state.auth.user?.id);
  const formUserId = useSelector((state: any) => state.form.authUser?.id);
  const userId = authUserId || formUserId || getStoredUserId();

  const handleDeleteAccount = async () => {
    if (!userId) {
      toast.error('User account not found. Please login again.');
      navigate('/signup', { replace: true });
      return;
    }

    try {
      await deleteUserAccount(Number(userId)).unwrap();
      toast.success('Your account has been permanently deleted.');
      clearClientStorage();
      dispatch(logout());
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Delete account failed:', error);
      toast.error('Failed to delete account. Please try again.');
    }
  };

  return (
    <main className="delete-account-page">
      <section className="delete-account-card">
        <p className="delete-account-eyebrow">Account settings</p>
        <h1>Delete Account</h1>
        <p>
          You can permanently delete your Bajol Matrimony account from this page. Once deleted, your profile will no longer be available in the app.
        </p>
        <p>
          This action removes your account and profile information from Bajol Matrimony. You will be logged out after the account is deleted.
        </p>

        <div className="delete-account-warning">
          <strong>Permanent action</strong>
          <span>After deletion, you cannot use the same account to view profiles, upload photos, or access paid features.</span>
        </div>

        <div className="delete-account-actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDeleteAccount}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Account Permanently'}
          </button>
        </div>
      </section>
    </main>
  );
};

export default DeleteAccount;
