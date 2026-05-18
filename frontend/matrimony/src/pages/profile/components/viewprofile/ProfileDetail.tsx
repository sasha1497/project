import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';
import { toast } from 'react-toastify';
import { useGetUserProfileQuery } from '../../../../features/profile/profileApi';
import { useAppLanguage } from '../../../../i18n/LanguageContext';
import Loader from '../../../../components/loader/loader';
import './viewprofile.css';

const API_BASE_URL = String(process.env.REACT_APP_API_BASE_URL || 'https://usrapi.bajolmatrimony.com').replace(/\/+$/, '');

const maskContactValue = (value?: string | null) => {
  const raw = String(value || '').trim();
  if (!raw) return 'XXXXXXXXXX';

  const visibleDigits = raw.replace(/\D/g, '').slice(-2);
  return `XXXXXX${visibleDigits || 'XX'}`;
};

const getProfileImages = (profile: any) =>
  profile?.userDetails?.imageData || profile?.imageData || [];

const getStoredAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem('authUser') || 'null');
  } catch {
    return null;
  }
};

const ProfileDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useAppLanguage();
  const authUser = useSelector((state: any) => state.auth.user);
  const formAuthUser = useSelector((state: any) => state.form.authUser);
  const storedAuthUser = useMemo(() => getStoredAuthUser(), []);
  const viewerUser = authUser || formAuthUser || storedAuthUser;
  const viewerUserId = viewerUser?.id;
  const profileId = Number(id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cashfree, setCashfree] = useState<any>(null);
  const [unlockingContact, setUnlockingContact] = useState(false);

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useGetUserProfileQuery({ id: profileId, viewerUserId }, {
    skip: !profileId || !viewerUserId,
  });

  const images = useMemo(() => getProfileImages(profile), [profile]);
  const currentImage = images[currentIndex] || images[0];

  useEffect(() => {
    (async () => {
      const cfInstance = await load({ mode: 'production' });
      setCashfree(cfInstance);
    })();
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [profileId]);

  const handleUnlockContact = async () => {
    if (!profile?.id || !viewerUserId) {
      toast.error('Unable to start payment');
      return;
    }

    if (!cashfree) {
      toast.error('Payment is loading. Please wait a moment.');
      return;
    }

    try {
      setUnlockingContact(true);

      const orderResponse = await axios.post(
        `${API_BASE_URL}/cashfree/create-profile-access-order`,
        {
          viewer_user_id: viewerUserId,
          target_user_id: profile.id,
          order_amount: 1,
          order_currency: 'INR',
          receipt: `profile_${viewerUserId}_${profile.id}_${Date.now()}`,
          customer_phone: viewerUser?.phone_number || viewerUser?.mobile || '',
          customer_email: viewerUser?.email || '',
        }
      );

      const sessionId = orderResponse?.data?.cashfree_order?.payment_session_id;
      const cashfreeOrderId = orderResponse?.data?.cashfree_order?.order_id;

      if (!sessionId || !cashfreeOrderId) {
        throw new Error('Failed to create payment order');
      }

      let contactConfirmed = false;
      const confirmContactUnlock = async () => {
        if (contactConfirmed) return;
        contactConfirmed = true;

        await axios.post(
          `${API_BASE_URL}/cashfree/confirm-profile-access-order`,
          { cashfree_order_id: cashfreeOrderId }
        );

        await refetch();
        toast.success('Contact unlocked successfully');
      };

      const checkoutResult = await cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: '_modal',
        onSuccess: async () => {
          try {
            await confirmContactUnlock();
          } catch (confirmError) {
            console.error(confirmError);
            toast.error('Payment succeeded but contact unlock failed');
          } finally {
            setUnlockingContact(false);
          }
        },
        onFailure: () => {
          toast.error('Payment failed, please try again');
          setUnlockingContact(false);
        },
        onClose: () => {
          setUnlockingContact(false);
        },
      });

      const checkoutSucceeded =
        checkoutResult?.paymentDetails ||
        checkoutResult?.order?.status === 'PAID' ||
        checkoutResult?.order?.status === 'ACTIVE' ||
        checkoutResult?.txStatus === 'SUCCESS';

      if (checkoutSucceeded) {
        await confirmContactUnlock();
        setUnlockingContact(false);
      } else if (!contactConfirmed) {
        setUnlockingContact(false);
      }
    } catch (paymentError: any) {
      console.error(paymentError);
      toast.error(
        paymentError?.response?.data?.message ||
        paymentError?.message ||
        'Unable to start profile payment'
      );
      setUnlockingContact(false);
    }
  };

  if (!profileId) {
    return <div className="profile-detail-page">{t('profile.view.errorLoading')}</div>;
  }

  if (!viewerUserId) return <Loader />;

  if (isLoading) return <Loader />;

  if (error || !profile) {
    return <div className="profile-detail-page">{t('profile.view.errorLoading')}</div>;
  }

  return (
    <div className="profile-detail-page">
      <button type="button" className="btn btn-outline-secondary mb-3" onClick={() => navigate('/profile')}>
        {t('profile.view.back')}
      </button>

      <div className="profile-detail-shell">
        <div className="profile-detail-media">
          {currentImage ? (
            <img
              src={currentImage.url}
              alt={currentImage.name || profile.name}
              className="profile-detail-image"
            />
          ) : (
            <div className="profile-detail-image profile-detail-image-empty">
              {t('profile.view.notAvailable')}
            </div>
          )}

          {images.length > 1 && (
            <div className="profile-detail-thumbs">
              {images.map((image: any, index: number) => (
                <button
                  type="button"
                  key={`${image.url}-${index}`}
                  className={`profile-detail-thumb ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img src={image.url} alt={image.name || `${profile.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="profile-detail-info">
          <h2>{profile?.name || t('profile.view.notAvailable')}</h2>
          <div className="view-profile-content">
            <p><strong>{t('profile.view.label.age')} :</strong> {profile?.age}</p>
            <p><strong>{t('profile.view.label.gender')} :</strong> {profile?.gender}</p>
            <p><strong>{t('profile.view.label.caste')}:</strong> {profile?.caste}</p>
            <p><strong>{t('profile.view.label.religion')}:</strong> {profile?.religion}</p>
            <p><strong>{t('profile.view.label.district')}:</strong> {profile?.district || profile?.userDetails?.district || t('profile.view.notAvailable')}</p>
            <p><strong>{t('profile.view.label.state')}:</strong> {profile?.state || profile?.userDetails?.state || t('profile.view.notAvailable')}</p>
            <p><strong>{t('profile.view.label.country')}:</strong> {profile?.country}</p>
            <p><strong>{t('profile.view.label.job')}:</strong> {profile?.job}</p>
            <p><strong>{t('profile.view.label.salary')}:</strong> {profile?.monthlySalary}</p>
            <p><strong>{t('profile.view.label.marriageStatus')}:</strong> {profile?.count || profile?.userDetails?.count || t('profile.view.notAvailable')}</p>
            <p><strong>{t('profile.view.label.whoseMarriage')}:</strong> {profile?.person}</p>
          </div>

          <div className="contact-unlock-card mt-3 mb-3 p-3 border rounded">
            <h6 className="mb-3">Contact Details</h6>
            {profile?.contactUnlocked ? (
              <>
                <div className="mb-2">
                  <strong>{t('profile.view.label.mobile')}:</strong>{' '}
                  {profile?.phone_number || t('profile.view.notAvailable')}
                </div>
                <div className="mb-3">
                  <strong>{t('profile.view.label.whatsapp')}:</strong>{' '}
                  {profile?.whatsapp || t('profile.view.notAvailable')}
                </div>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <strong>{t('profile.view.label.mobile')}:</strong>{' '}
                  {maskContactValue(profile?.phone_number)}
                </div>
                <div className="mb-3">
                  <strong>{t('profile.view.label.whatsapp')}:</strong>{' '}
                  {maskContactValue(profile?.whatsapp)}
                </div>
                <p className="mb-3">
                  Pay 49 RS to Bajol for this mobile number and WhatsApp number. We use Cashfree for secure payments.
                </p>
                <button
                  type="button"
                  className="btn btn-warning fs-5"
                  disabled={unlockingContact || !profile?.id || !viewerUserId || !cashfree}
                  onClick={handleUnlockContact}
                >
                  {unlockingContact ? 'Processing...' : !cashfree ? 'Payment loading...' : 'Pay Now'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileDetail);
