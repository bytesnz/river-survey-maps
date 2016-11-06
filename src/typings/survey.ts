interface Survey {
  _id: {
    $oid: string
  },
  location: {
    _wgs84: [number, number]
  },
  layer: string,
  status: string,
  subdomain: string,
  surveyId: {
    $oid: string
  },
  timestamp: {
    _epoch: number,
    _iso8601: string
  }
}
