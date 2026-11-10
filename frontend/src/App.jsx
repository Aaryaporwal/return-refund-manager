
import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:8081/returns'

function getStatusClass(status) {
  const value = status?.toUpperCase()

  if (value === 'APPROVED') return 'approved'
  if (value === 'REJECTED') return 'rejected'

  return 'pending'
}

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    customerName: '',
    productName: '',
    reason: '',
    purchaseDate: ''
  })

  // FETCH ALL REQUESTS
  const fetchReturns = () => {
    setLoading(true)

    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Unable to fetch return requests')
        }
        return response.json()
      })
      .then(data => {
        setReturns(data)
        setError('')
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchReturns()
  }, [])

  // HANDLE FORM INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // CREATE NEW REQUEST
  const handleSubmit = async (e) => {
    e.preventDefault()

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          productName: formData.productName,
          reason: formData.reason,
          purchaseDate: formData.purchaseDate || null,
          status: 'REQUESTED'
        })
      })

      if (!response.ok) {
        throw new Error('Unable to create return request')
      }

      const newRequest = await response.json()

      setReturns(previous => [...previous, newRequest])

      setSuccess(
        `Request #RET${String(newRequest.id).padStart(3, '0')} created successfully!`
      )

      setFormData({
        customerName: '',
        productName: '',
        reason: '',
        purchaseDate: ''
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // APPROVE OR REJECT REQUEST
  const handleStatusUpdate = async (id, newStatus) => {
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: newStatus
      })

      if (!response.ok) {
        throw new Error('Unable to update request status')
      }

      const updatedRequest = await response.json()

      setReturns(previous =>
        previous.map(item =>
          item.id === id ? updatedRequest : item
        )
      )

      setSuccess(
        `Request #RET${String(id).padStart(3, '0')} ${newStatus.toLowerCase()} successfully!`
      )

    } catch (err) {
      setError(err.message)
    }
  }

  // DASHBOARD STATISTICS
  const totalReturns = returns.length

  const approvedReturns = returns.filter(
    item => item.status?.toUpperCase() === 'APPROVED'
  ).length

  const pendingReturns = returns.filter(
    item =>
      item.status?.toUpperCase() === 'REQUESTED' ||
      item.status?.toUpperCase() === 'PENDING'
  ).length

  const rejectedReturns = returns.filter(
    item => item.status?.toUpperCase() === 'REJECTED'
  ).length

  const eligibleReturns = returns.filter(
    item => item.eligibleForReturn === true
  ).length

  const recentRequests = [...returns]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)

  // REUSABLE TABLE
  const renderRequestsTable = (data) => (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Purchase Date</th>
            <th>Status</th>
            <th>Eligibility</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map(request => (
            <tr key={request.id}>
              <td>#RET{String(request.id).padStart(3, '0')}</td>

              <td>{request.customerName}</td>

              <td>{request.productName}</td>

              <td>{request.purchaseDate || 'Not provided'}</td>

              <td>
                <span className={`status ${getStatusClass(request.status)}`}>
                  {request.status}
                </span>
              </td>

              <td>
                <span className={`status ${
                  request.eligibleForReturn ? 'approved' : 'rejected'
                }`}>
                  {request.eligibleForReturn ? 'Eligible' : 'Not eligible'}
                </span>
              </td>

              <td>
                {request.status?.toUpperCase() === 'REQUESTED' ||
                 request.status?.toUpperCase() === 'PENDING' ? (
                  <div style={{ display: 'flex', gap: '6px' }}>

                    <button
                      onClick={() =>
                        handleStatusUpdate(request.id, 'APPROVED')
                      }
                      style={{
                        background: '#198754',
                        color: 'white',
                        padding: '7px 12px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        handleStatusUpdate(request.id, 'REJECTED')
                      }
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        padding: '7px 12px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Reject
                    </button>

                  </div>
                ) : (
                  <span>Processed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && <p>No return requests found.</p>}
    </div>
  )

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h2 className="brand">
          Return<span>.</span>Care
        </h2>

        <p className="menu-title">MENU</p>

        {['Dashboard', 'All Returns', 'New Request', 'Settings'].map(item => (
          <button
            key={item}
            className={activeTab === item ? 'nav-item active' : 'nav-item'}
            onClick={() => {
              setActiveTab(item)
              setError('')
              setSuccess('')
            }}
          >
            {item}
          </button>
        ))}

        <div className="sidebar-bottom">
          <p>Return Management System</p>
          <small>Version 1.0</small>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main">

        <header className="topbar">
          <div>
            <h2>{activeTab}</h2>
            <p>Welcome back! Manage your returns here.</p>
          </div>

          <div className="profile">
            <div className="avatar">A</div>
            <span>Admin</span>
          </div>
        </header>

        {loading && <p>Loading return requests...</p>}

        {error && (
          <p style={{ color: '#A85F53' }}>{error}</p>
        )}

        {success && (
          <p style={{ color: 'green', margin: '15px 0' }}>
            {success}
          </p>
        )}

        {!loading && !error && (
          <>

            {/* DASHBOARD */}
            {activeTab === 'Dashboard' && (
              <>
                <section className="welcome">
                  <div>
                    <h1>Return Management Dashboard</h1>
                    <p>Track and manage customer return requests.</p>
                  </div>
                  <span>November 2026</span>
                </section>

                <section className="stats">

                  <div className="stat-card">
                    <p>Total Returns</p>
                    <h2>{totalReturns}</h2>
                    <small>All return requests</small>
                  </div>

                  <div className="stat-card">
                    <p>Approved</p>
                    <h2>{approvedReturns}</h2>
                    <small>Approved requests</small>
                  </div>

                  <div className="stat-card">
                    <p>Pending</p>
                    <h2>{pendingReturns}</h2>
                    <small>Awaiting review</small>
                  </div>

                  <div className="stat-card">
                    <p>Rejected</p>
                    <h2>{rejectedReturns}</h2>
                    <small>Rejected requests</small>
                  </div>

                </section>

                <section className="table-section">

                  <div className="table-heading">
                    <div>
                      <h2>Recent Return Requests</h2>
                      <p>
                        {eligibleReturns} requests currently eligible for return
                      </p>
                    </div>

                    <button onClick={() => setActiveTab('All Returns')}>
                      View All
                    </button>
                  </div>

                  {renderRequestsTable(recentRequests)}

                </section>
              </>
            )}

            {/* ALL RETURNS */}
            {activeTab === 'All Returns' && (
              <section className="table-section">

                <div className="table-heading">
                  <div>
                    <h2>All Return Requests</h2>
                    <p>Complete history of customer returns</p>
                  </div>
                </div>

                {renderRequestsTable(
                  [...returns].sort((a, b) => b.id - a.id)
                )}

              </section>
            )}

            {/* NEW REQUEST */}
            {activeTab === 'New Request' && (
              <section className="table-section">

                <h2>Create Return Request</h2>
                <p>Enter the customer and product details below.</p>

                <form
                  onSubmit={handleSubmit}
                  style={{ maxWidth: '600px', marginTop: '25px' }}
                >

                  <div style={{ marginBottom: '20px' }}>
                    <label>Customer Name</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Enter customer name"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        marginTop: '8px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        marginTop: '8px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label>Return Reason</label>
                    <select
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        marginTop: '8px'
                      }}
                    >
                      <option value="">Select a reason</option>
                      <option value="Product damaged">Product damaged</option>
                      <option value="Wrong product">Wrong product</option>
                      <option value="Changed my mind">Changed my mind</option>
                      <option value="Product defective">Product defective</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <label>Purchase Date</label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      max={new Date().toLocaleDateString('en-CA')}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        marginTop: '8px'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: '12px 25px',
                      background: '#193f4b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Return Request'}
                  </button>

                </form>

              </section>
            )}

            {/* SETTINGS */}
            {activeTab === 'Settings' && (
              <section className="table-section">
                <h2>Settings</h2>
                <p>Application settings will appear here.</p>
              </section>
            )}

          </>
        )}

      </main>
    </div>
  )
}

export default App
