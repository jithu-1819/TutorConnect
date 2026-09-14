import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookingById, updateBookingStatus, updateMeetingLink, clearBookingSuccess } from '../../store/slices/bookingsSlice';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getStatusColor, capitalize, formatDate, formatTime } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const BookingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedBooking: booking, loading, error, successMessage } = useSelector((s) => s.bookings);
  const [meetingLinkInput, setMeetingLinkInput] = useState('');
  const [showLinkForm, setShowLinkForm] = useState(false);

  useEffect(() => { dispatch(fetchBookingById(id)); }, [dispatch, id]);
  useEffect(() => { if (successMessage) { setTimeout(() => dispatch(clearBookingSuccess()), 3000); } }, [successMessage, dispatch]);
  useEffect(() => {
    if (booking?.meetingLink) {
      setMeetingLinkInput(booking.meetingLink);
    }
  }, [booking]);

  if (loading) return <div className="page-container"><LoadingSpinner text="Loading booking..." /></div>;
  if (error) return <div className="page-container"><ErrorMessage message={error} /></div>;
  if (!booking) return <div className="page-container"><ErrorMessage message="Booking not found" /></div>;

  const isStudent = user?.role === 'student';
  const isTutor = user?.role === 'tutor';

  const handleSaveMeetingLink = () => {
    dispatch(updateMeetingLink({ id: booking._id, meetingLink: meetingLinkInput }));
    setShowLinkForm(false);
  };

  return (
    <div className="page-container max-w-3xl">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm mb-6">
        ← Back
      </button>

      {successMessage && (
        <div className="p-4 rounded-xl bg-success-500/10 border border-success-500/20 text-success-500 text-sm mb-6 animate-slide-down">
          ✓ {successMessage}
        </div>
      )}

      <div className="card-flat animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-surface-50">Booking Details</h1>
          <span className={`badge ${getStatusColor(booking.status)} text-sm px-4 py-1`}>
            {capitalize(booking.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Tutor</p>
              <p className="text-lg font-semibold text-surface-100">{booking.tutorId?.name}</p>
              <p className="text-sm text-surface-400">{booking.tutorId?.email}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Student</p>
              <p className="text-lg font-semibold text-surface-100">{booking.studentId?.name}</p>
              <p className="text-sm text-surface-400">{booking.studentId?.email}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Subject</p>
              <p className="text-surface-200 font-medium">{booking.subject}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Schedule</p>
              {booking.availabilitySlotId && (
                <p className="text-surface-200">
                  {capitalize(booking.availabilitySlotId.dayOfWeek)},{' '}
                  {formatTime(booking.availabilitySlotId.startTime)} – {formatTime(booking.availabilitySlotId.endTime)}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Amount</p>
              <p className="text-2xl font-bold text-primary-400 font-display">${booking.amount}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Booked On</p>
              <p className="text-surface-200">{formatDate(booking.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Payment</p>
              <span className={`badge ${booking.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                {capitalize(booking.paymentStatus)}
              </span>
            </div>
          </div>
        </div>

        {booking.notes && (
          <div className="mt-6 p-4 rounded-xl bg-surface-900 border border-surface-700">
            <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm text-surface-300">{booking.notes}</p>
          </div>
        )}

        {/* Meeting Link Section */}
        {(booking.status === 'confirmed' || booking.status === 'pending') && (
          <div className="mt-6 p-4 rounded-xl bg-primary-500/5 border border-primary-500/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-surface-500 uppercase tracking-wider">Meeting Link</p>
              {isTutor && (
                <button
                  onClick={() => setShowLinkForm(!showLinkForm)}
                  className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {booking.meetingLink ? 'Edit Link' : '+ Add Link'}
                </button>
              )}
            </div>
            {showLinkForm && isTutor ? (
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  className="form-input flex-1 text-sm"
                  placeholder="https://meet.google.com/... or https://zoom.us/..."
                  value={meetingLinkInput}
                  onChange={(e) => setMeetingLinkInput(e.target.value)}
                />
                <button onClick={handleSaveMeetingLink} className="btn btn-primary btn-sm">Save</button>
                <button onClick={() => setShowLinkForm(false)} className="btn btn-ghost btn-sm">Cancel</button>
              </div>
            ) : booking.meetingLink ? (
              <a
                href={booking.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                Join Meeting
              </a>
            ) : (
              <p className="text-sm text-surface-500">
                {isTutor ? 'Add a meeting link so your student can join the session.' : 'Waiting for tutor to share the meeting link.'}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-surface-700">
          {isStudent && booking.status === 'completed' && (
            <Link to={`/reviews/new/${booking._id}`} className="btn btn-accent">Write a Review</Link>
          )}
          {isStudent && (booking.status === 'pending' || booking.status === 'confirmed') && (
            <button onClick={() => dispatch(updateBookingStatus({ id: booking._id, status: 'cancelled' }))} className="btn btn-danger">
              Cancel Booking
            </button>
          )}
          {isTutor && booking.status === 'pending' && (
            <>
              <button onClick={() => dispatch(updateBookingStatus({ id: booking._id, status: 'confirmed' }))} className="btn btn-success">
                Accept
              </button>
              <button onClick={() => dispatch(updateBookingStatus({ id: booking._id, status: 'cancelled' }))} className="btn btn-danger">
                Reject
              </button>
            </>
          )}
          {isTutor && booking.status === 'confirmed' && (
            <button onClick={() => dispatch(updateBookingStatus({ id: booking._id, status: 'completed' }))} className="btn btn-success">
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
