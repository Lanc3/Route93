import { useState } from 'react'
import UserSettingsTab from 'src/components/UserSettingsTab/UserSettingsTab'
import PurchaseHistoryTab from 'src/components/PurchaseHistoryTab/PurchaseHistoryTab'
import CurrentOrdersTab from 'src/components/CurrentOrdersTab/CurrentOrdersTab'
import AddressesTab from 'src/components/AddressesTab/AddressesTab'

const AccountSettingsTabs = ({ user }) => {
  const [activeTab, setActiveTab] = useState('settings')

  const tabs = [
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'purchase-history', name: 'Purchase History', icon: '📋' },
    { id: 'current-orders', name: 'Current Orders', icon: '📦' },
    { id: 'addresses', name: 'Addresses', icon: '🏠' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return <UserSettingsTab user={user} />
      case 'purchase-history':
        return <PurchaseHistoryTab user={user} />
      case 'current-orders':
        return <CurrentOrdersTab user={user} />
      case 'addresses':
        return <AddressesTab user={user} onRefresh={() => window.location.reload()} />
      default:
        return <UserSettingsTab user={user} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default AccountSettingsTabs
