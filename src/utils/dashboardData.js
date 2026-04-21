export const adminSidebarSections = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/admin", icon: "📊" },
      { label: "Analytics", path: "/admin/analytics", icon: "📈" },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Matches", path: "/admin/matches", icon: "🏏", badge: "2" },
      { label: "Players", path: "/admin/players", icon: "👥", badge: "5" },
       { label: "Teams", path: "/admin/teams", icon: "🏆" },
          { label: "Sponsors", path: "/admin/sponsors", icon: "🤝" }, 
          { label: "Franchises", path: "/admin/franchises", icon: "🏢" },
          { label: "Announcements", path: "/admin/announcements", icon: "📢" },
    { label: "Latest News", path: "/admin/latest-news", icon: "📰" },
     
    
      { label: "Live Match", path: "/admin/live-match", icon: "📡", badge: "LIVE" },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Finance", path: "/admin/finance", icon: "💰" },
      { label: "Approvals", path: "/admin/approvals", icon: "✅", badge: "3" },
    ],
  },
];

export const adminStats = [
  {
    label: "Total Revenue",
    value: "₹48.6L",
    subtext: "↑ 12% vs last season",
    color: "gold",
    icon: "💰",
  },
  {
    label: "Active Matches",
    value: "2",
    subtext: "1 live now",
    color: "red",
    icon: "🏏",
  },
  {
    label: "Registered Players",
    value: "164",
    subtext: "+8 this week",
    color: "green",
    icon: "👥",
  },
  {
    label: "Total Teams",
    value: "8",
    subtext: "All franchises active",
    color: "blue",
    icon: "🏆",
  },
  {
    label: "Matches Played",
    value: "34",
    subtext: "of 56 total fixtures",
    color: "orange",
    icon: "📅",
  },
  {
    label: "Pending Approvals",
    value: "5",
    subtext: "Needs attention",
    color: "purple",
    icon: "⚠️",
  },
];

export const pointsTableRows = [
  { rank: 1, team: "Raynx Rockets", played: 10, won: 8, lost: 2, nrr: "+1.42", points: 16, dot: "#e8233a" },
  { rank: 2, team: "Code Crushers", played: 10, won: 7, lost: 3, nrr: "+0.88", points: 14, dot: "#3b82f6" },
  { rank: 3, team: "Bug Busters", played: 10, won: 6, lost: 4, nrr: "+0.34", points: 12, dot: "#a855f7" },
  { rank: 4, team: "Stack Warriors", played: 10, won: 5, lost: 5, nrr: "-0.12", points: 10, dot: "#22c55e" },
  { rank: 5, team: "Git Gladiators", played: 10, won: 4, lost: 6, nrr: "-0.56", points: 8, dot: "#f97316" },
  { rank: 6, team: "DevOps Dragons", played: 10, won: 3, lost: 7, nrr: "-0.98", points: 6, dot: "#f5c518" },
];

export const recentActivities = [
  { icon: "🏏", color: "red", text: "Match 35 started — Raynx Rockets vs Mumbai Nodes", time: "2 min ago" },
  { icon: "✅", color: "green", text: "Player Arjun Mehta approved for Code Crushers", time: "28 min ago" },
  { icon: "💰", color: "gold", text: "Invoice #INV-081 paid — ₹3.2L from TechSponsor", time: "1 hr ago" },
  { icon: "📋", color: "blue", text: "Lineup locked for Match 36 — Bug Busters vs Stack Warriors", time: "2 hr ago" },
  { icon: "🔨", color: "purple", text: "Auction S2 scheduled for 15 Apr 2025", time: "Yesterday" },
];

export const topPerformers = [
  { initials: "VK", name: "Viswanadh M", role: "BAT/WK", roleColor: "green", team: "Raynx Rockets", points: 486, avatarColor: "gold" },
  { initials: "VD", name: "Vinod", role: "A/R", roleColor: "orange", team: "Raynx Rockets", points: 421, avatarColor: "blue" },
  { initials: "SD", name: "Sandeep", role: "BOWL", roleColor: "blue", team: "Raynx Rockets", points: 398, avatarColor: "green" },
  { initials: "VP", name: "Vara Prasad", role: "BAT", roleColor: "purple", team: "Raynx Rockets", points: 372, avatarColor: "purple" },
  { initials: "ST", name: "Sathyam", role: "BAT", roleColor: "green", team: "Raynx Rockets", points: 341, avatarColor: "orange" },
];

export const analyticsKpis = [
  {
    label: "Page Views",
    value: "2.48L",
    subtext: "↑ 18% this week",
    color: "blue",
    icon: "📈",
  },
  {
    label: "Active Users",
    value: "12.4K",
    subtext: "Peak during live matches",
    color: "green",
    icon: "👥",
  },
  {
    label: "Avg Session",
    value: "08m 24s",
    subtext: "↑ 11% engagement",
    color: "purple",
    icon: "⏱️",
  },
  {
    label: "Revenue CTR",
    value: "6.8%",
    subtext: "Sponsor click-through",
    color: "gold",
    icon: "💰",
  },
];

export const trafficTrendData = [
  { name: "Mon", views: 1800 },
  { name: "Tue", views: 2200 },
  { name: "Wed", views: 2600 },
  { name: "Thu", views: 2400 },
  { name: "Fri", views: 3200 },
  { name: "Sat", views: 4800 },
  { name: "Sun", views: 4300 },
];

export const revenueBreakdownData = [
  { name: "Sponsors", value: 38 },
  { name: "Tickets", value: 26 },
  { name: "Merch", value: 14 },
  { name: "Ads", value: 12 },
  { name: "Other", value: 10 },
];

export const budgetUtilizationData = [
  { name: "Ops", amount: 72 },
  { name: "Media", amount: 56 },
  { name: "Travel", amount: 64 },
  { name: "Venue", amount: 81 },
  { name: "Tech", amount: 48 },
];

export const attendanceTrendData = [
  { name: "Match 31", fans: 820 },
  { name: "Match 32", fans: 910 },
  { name: "Match 33", fans: 760 },
  { name: "Match 34", fans: 1020 },
  { name: "Match 35", fans: 1180 },
];

export const matchListData = [
  {
    id: "M35",
    fixture: "Raynx Rockets vs Code Crusaders",
    venue: "Hyderabad Arena",
    date: "23 Mar 2026",
    status: "Live",
    umpire: "Ajay Kumar",
  },
  {
    id: "M36",
    fixture: "Debug Kings vs Frontend Pirates",
    venue: "Bangalore Oval",
    date: "24 Mar 2026",
    status: "Upcoming",
    umpire: "Ravi Teja",
  },
  {
    id: "M37",
    fixture: "API Strikers vs Cloud Warriors",
    venue: "Pune Ground",
    date: "24 Mar 2026",
    status: "Upcoming",
    umpire: "Nitin Rao",
  },
  {
    id: "M38",
    fixture: "Data Smashers vs QA Avengers",
    venue: "Chennai Park",
    date: "25 Mar 2026",
    status: "Draft",
    umpire: "Kiran Dev",
  },
];

export const scoreSummaryData = [
  {
    title: "Live Score Entries",
    value: "18",
    note: "Updated in last 30 mins",
    color: "red",
    icon: "🏏",
  },
  {
    title: "Lineups Locked",
    value: "6",
    note: "2 pending today",
    color: "green",
    icon: "✅",
  },
  {
    title: "Venue Ready",
    value: "4",
    note: "1 under review",
    color: "blue",
    icon: "📍",
  },
  {
    title: "Alerts Open",
    value: "3",
    note: "Scoring + logistics",
    color: "purple",
    icon: "🚨",
  },
];

export const playerRegistryData = [
  {
    id: "PL101",
    name: "Viswanadh",
    team: "Raynx Rockets",
    role: "All-Rounder",
    status: "Active",
   salary:"0"
  },
  {
    id: "PL102",
    name: "Vinod",
    team: "Code Crusaders",
    role: "Batsman",
    status: "Active",
   salary:"0"
  },
  {
    id: "PL103",
    name: "Prasad",
    team: "Debug Kings",
    role: "Bowler",
    status: "Injured",
 salary:"0"
  },
  {
    id: "PL104",
    name: "Sandeep",
    team: "Frontend Pirates",
    role: "All-Rounder",
    status: "Suspended",
  salary:"0"
  },
  {
    id: "PL105",
    name: "Karthik",
    team: "API Strikers",
    role: "Wicket Keeper",
    status: "Active",
 salary:"0"
  },
  {
    id: "PL106",
    name: "Harsha",
    team: "Cloud Warriors",
    role: "Bowler",
    status: "Pending",
  salary:"0"
  },
];

export const financeSummaryCards = [
  {
    label: "Total Revenue",
    value: "₹24.8L",
    subtext: "↑ 12% from last month",
    color: "green",
    icon: "💰",
  },
  {
    label: "Pending Invoices",
    value: "14",
    subtext: "Needs settlement",
    color: "red",
    icon: "🧾",
  },
  {
    label: "Sponsor Collections",
    value: "₹9.6L",
    subtext: "3 major sponsors",
    color: "blue",
    icon: "🤝",
  },
  {
    label: "Budget Utilized",
    value: "68%",
    subtext: "Healthy usage",
    color: "gold",
    icon: "📊",
  },
];

export const invoiceTableData = [
  {
    id: "INV-1001",
    party: "TechNova Sponsors",
    category: "Sponsorship",
    amount: "₹3,20,000",
    dueDate: "25 Mar 2026",
    status: "Pending",
  },
  {
    id: "INV-1002",
    party: "Hyderabad Arena",
    category: "Venue",
    amount: "₹1,45,000",
    dueDate: "22 Mar 2026",
    status: "Paid",
  },
  {
    id: "INV-1003",
    party: "Match Officials Board",
    category: "Operations",
    amount: "₹78,000",
    dueDate: "27 Mar 2026",
    status: "Pending",
  },
  {
    id: "INV-1004",
    party: "Merch Partner",
    category: "Merchandise",
    amount: "₹2,10,000",
    dueDate: "21 Mar 2026",
    status: "Paid",
  },
  {
    id: "INV-1005",
    party: "Streaming Vendor",
    category: "Media",
    amount: "₹96,000",
    dueDate: "29 Mar 2026",
    status: "Overdue",
  },
];

export const financeRevenueBreakdown = [
  { name: "Sponsors", value: 42 },
  { name: "Tickets", value: 24 },
  { name: "Streaming", value: 14 },
  { name: "Merch", value: 12 },
  { name: "Other", value: 8 },
];

export const settlementWidgets = [
  {
    title: "Upcoming Settlements",
    value: "₹3.24L",
    note: "Due in next 5 days",
    color: "yellow",
    icon: "⏳",
  },
  {
    title: "Completed Settlements",
    value: "₹12.8L",
    note: "This month",
    color: "green",
    icon: "✅",
  },
  {
    title: "Overdue Amount",
    value: "₹96K",
    note: "1 invoice delayed",
    color: "red",
    icon: "⚠️",
  },
];

export const franchiseSummaryCards = [
  {
    label: "Squad Strength",
    value: "16/18",
    subtext: "2 slots remaining",
    color: "blue",
    icon: "👥",
  },
  {
    label: "Available Budget",
    value: "₹4.2L",
    subtext: "After latest auction",
    color: "green",
    icon: "💼",
  },
  {
    label: "Wins This Season",
    value: "6",
    subtext: "Top table form",
    color: "gold",
    icon: "🏆",
  },
  {
    label: "Pending Notices",
    value: "3",
    subtext: "Need action",
    color: "red",
    icon: "📢",
  },
];

export const franchiseNotices = [
  {
    id: 1,
    title: "Practice session moved to Saturday 7:00 AM",
    type: "Schedule",
    date: "23 Mar 2026",
  },
  {
    id: 2,
    title: "Submit final playing XI before 6 PM",
    type: "Matchday",
    date: "24 Mar 2026",
  },
  {
    id: 3,
    title: "Medical update required for 2 players",
    type: "Squad",
    date: "24 Mar 2026",
  },
];

export const franchiseSquadSummary = [
  { name: "Batsmen", value: 6 },
  { name: "Bowlers", value: 5 },
  { name: "All-Rounders", value: 3 },
  { name: "Wicket Keepers", value: 2 },
];

export const franchiseBudgetTrend = [
  { name: "Week 1", amount: 8.5 },
  { name: "Week 2", amount: 7.8 },
  { name: "Week 3", amount: 6.4 },
  { name: "Week 4", amount: 5.7 },
  { name: "Week 5", amount: 4.2 },
];

export const franchiseNextMatch = {
  fixture: "Raynx Rockets vs Debug Kings",
  venue: "Hyderabad Arena",
  date: "27 Mar 2026",
  time: "7:30 PM",
  note: "Win to secure playoff qualification",
};

export const teamSummaryCards = [
  {
    label: "Total Teams",
    value: "8",
    subtext: "All franchises active",
    color: "blue",
    icon: "Teams",
  },
  {
    label: "Qualified",
    value: "4",
    subtext: "Playoff race active",
    color: "green",
    icon: "Qualified",
  },
  {
    label: "Pending Team Updates",
    value: "3",
    subtext: "Need admin review",
    color: "red",
    icon: "Updates",
  },
  {
    label: "Average Squad Size",
    value: "16",
    subtext: "Per franchise",
    color: "gold",
    icon: "Squad",
  },
];

export const adminTeamsData = [
  {
    id: "TM01",
    name: "Raynx Rockets",
    city: "Hyderabad",
    captain: "Viswanadh",
    owner: "Raynx Systems",
    squadCount: 16,
    budgetLeft: "₹4.2L",
    status: "Active",
  },
  {
    id: "TM02",
    name: "Code Crusaders",
    city: "Bangalore",
    captain: "Vinod",
    owner: "Crusader Tech",
    squadCount: 15,
    budgetLeft: "₹3.8L",
    status: "Active",
  },
  {
    id: "TM03",
    name: "Debug Kings",
    city: "Chennai",
    captain: "Prasad",
    owner: "Debug Group",
    squadCount: 14,
    budgetLeft: "₹5.1L",
    status: "Pending",
  },
  {
    id: "TM04",
    name: "Frontend Pirates",
    city: "Mumbai",
    captain: "Sandeep",
    owner: "Pirates Digital",
    squadCount: 16,
    budgetLeft: "₹2.9L",
    status: "Active",
  },
  {
    id: "TM05",
    name: "API Strikers",
    city: "Pune",
    captain: "Karthik",
    owner: "API Labs",
    squadCount: 13,
    budgetLeft: "₹6.0L",
    status: "Review",
  },
];

export const approvalSummaryCards = [
  {
    label: "Pending Approvals",
    value: "12",
    subtext: "Need admin action",
    color: "red",
    icon: "Pending",
  },
  {
    label: "Approved Today",
    value: "8",
    subtext: "Updated recently",
    color: "green",
    icon: "Approved",
  },
  {
    label: "Rejected",
    value: "2",
    subtext: "Needs follow-up",
    color: "orange",
    icon: "Rejected",
  },
  {
    label: "Escalated",
    value: "1",
    subtext: "High-priority case",
    color: "purple",
    icon: "Escalated",
  },
];

export const approvalsData = [
  {
    id: "AP01",
    requestType: "Player Registration",
    requestedBy: "Raynx Rockets",
    subject: "Add Harsha to active squad",
    date: "24 Mar 2026",
    priority: "High",
    status: "Pending",
  },
  {
    id: "AP02",
    requestType: "Medical Clearance",
    requestedBy: "Code Crusaders",
    subject: "Fitness approval for Vinod",
    date: "24 Mar 2026",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: "AP03",
    requestType: "Budget Request",
    requestedBy: "API Strikers",
    subject: "Extra travel budget approval",
    date: "23 Mar 2026",
    priority: "Low",
    status: "Approved",
  },
  {
    id: "AP04",
    requestType: "Squad Transfer",
    requestedBy: "Debug Kings",
    subject: "Internal player role change",
    date: "23 Mar 2026",
    priority: "High",
    status: "Pending",
  },
  {
    id: "AP05",
    requestType: "Match Exception",
    requestedBy: "Frontend Pirates",
    subject: "Late lineup submission request",
    date: "22 Mar 2026",
    priority: "High",
    status: "Rejected",
  },
];
export const adminAnnouncementsData = [
  {
    id: "AN01",
    title: "Weekend Match Reporting Time Updated",
    description:
      "All players must report to the venue at least 45 minutes before toss for attendance and warm-up.",
    date: "31 Mar 2026",
    status: "Published",
  },
  {
    id: "AN02",
    title: "Semi-Final Venue Will Be Announced Soon",
    description:
      "The organizing committee is finalizing the semi-final venue and will publish confirmed details shortly.",
    date: "29 Mar 2026",
    status: "Draft",
  },
  {
    id: "AN03",
    title: "Player Registration Closes This Friday",
    description:
      "Franchise managers should complete player registration and submit final squad updates before Friday 6:00 PM.",
    date: "30 Mar 2026",
    status: "Published",
  },
];
export const adminLatestNewsData = [
  {
    id: "NW01",
    category: "Match Report",
    title: "Raynx Rockets Seal A Thrilling Win",
    description:
      "A dramatic finish under lights saw Raynx Rockets chase down the target with 2 balls to spare.",
    date: "16 Mar 2026",
    status: "Published",
  },
  {
    id: "NW02",
    category: "League Update",
    title: "Season 1 Playoff Race Heats Up",
    description:
      "The top four battle is tighter than ever as teams fight for qualification spots.",
    date: "15 Mar 2026",
    status: "Published",
  },
  {
    id: "NW03",
    category: "Player Spotlight",
    title: "Top Performers Of The Week Announced",
    description:
      "Standout batting, bowling, and all-round performances earned recognition across the league.",
    date: "14 Mar 2026",
    status: "Draft",
  },
  {
    id: "NW04",
    category: "Platform News",
    title: "New Fan Engagement Features Planned",
    description:
      "Interactive polls, predictions, and more digital experiences are coming soon to SPL.",
    date: "13 Mar 2026",
    status: "Published",
  },
];  

export const sponsorRows = [
  {
    sponsorId: "SPN-001",
    sponsorName: "Raynx Tech",
    logo: "https://via.placeholder.com/40x40.png?text=RT",
    website: "https://raynxtech.com",
    contactDetails: "raynxtech@gmail.com | +91 9876543210",
    sponsorTournament: "SPL 2026",
    tournamentId: "TRN-2026-01",
    sponsorType: "Title Sponsor",
    amount: "₹15,00,000",
  },
  {
    sponsorId: "SPN-002",
    sponsorName: "BlueWave Media",
    logo: "https://via.placeholder.com/40x40.png?text=BW",
    website: "https://bluewave.com",
    contactDetails: "media@bluewave.com | +91 9123456780",
    sponsorTournament: "SPL 2026",
    tournamentId: "TRN-2026-01",
    sponsorType: "Media Partner",
    amount: "₹7,50,000",
  },
  {
    sponsorId: "SPN-003",
    sponsorName: "FitFuel",
    logo: "https://via.placeholder.com/40x40.png?text=FF",
    website: "https://fitfuel.in",
    contactDetails: "hello@fitfuel.in | +91 9988776655",
    sponsorTournament: "SPL Women 2026",
    tournamentId: "TRN-2026-02",
    sponsorType: "Nutrition Sponsor",
    amount: "₹4,00,000",
  },
];
export const franchiseRegistryData = [
  {
    id: "FR01",
    companyName: "Raynx Sports Pvt Ltd",
    ownerName: "Viswanadh M",
    contactEmail: "raynxsports@gmail.com",
    contactPhone: "+91 9876543210",
    logo: "",
    address: "Madhapur, Hyderabad, Telangana",
    website: "https://raynxsports.com",
    status: "Active",
  },
  {
    id: "FR02",
    companyName: "Code Crusaders Ventures",
    ownerName: "Vinod Kumar",
    contactEmail: "codecrusaders@gmail.com",
    contactPhone: "+91 9988776655",
    logo: "",
    address: "Whitefield, Bangalore, Karnataka",
    website: "https://codecrusaders.com",
    status: "Active",
  },
  {
    id: "FR03",
    companyName: "Debug Kings Holdings",
    ownerName: "Prasad",
    contactEmail: "debugkings@gmail.com",
    contactPhone: "+91 9123456789",
    logo: "",
    address: "T Nagar, Chennai, Tamil Nadu",
    website: "https://debugkings.com",
    status: "Review",
  },
];

export const franchiseRegistrySummaryCards = [
  {
    label: "Total Franchises",
    value: "3",
    subtext: "Registered in admin panel",
    color: "blue",
    icon: "Teams",
  },
  {
    label: "Active Franchises",
    value: "2",
    subtext: "Operational now",
    color: "green",
    icon: "Qualified",
  },
  {
    label: "Pending Review",
    value: "1",
    subtext: "Needs approval",
    color: "orange",
    icon: "Updates",
  },
  {
    label: "Contact Records",
    value: "3",
    subtext: "Email and phone maintained",
    color: "gold",
    icon: "Squad",
  },
];


export const franchiseSidebarSections = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/franchise", icon: "📊" },
    ],
  },
  {
    title: "Registration",
    items: [
      { label: "Team Registration", path: "/franchise/team-registration", icon: "📝" },
    
    ],
  },
  {
    title: "Squad",
    items: [
      { label: "Player Information", path: "/franchise/player-info", icon: "📋" },
      { label: "Teams", path: "/franchise/teams", icon: "👥" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Team Performance", path: "/franchise/team-performance", icon: "📈" },
      { label: "Match Reports", path: "/franchise/match-reports", icon: "📄" },
    ],

  },
];