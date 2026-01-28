#ifndef HAVERSINE_H
#define HAVERSINE_H

#include <cmath>

static constexpr double EARTH_RADIUS_KM = 6371.0;
inline double deg2rad(double deg) { return deg * M_PI / 180.0; }
inline double haversine(double lat1, double lon1, double lat2, double lon2) {
    double dlat = deg2rad(lat2 - lat1);
    double dlon = deg2rad(lon2 - lon1);
    double a = sin(dlat/2.0)*sin(dlat/2.0) + cos(deg2rad(lat1))*cos(deg2rad(lat2)) * sin(dlon/2.0)*sin(dlon/2.0);
    double c = 2 * atan2(sqrt(a), sqrt(1-a));
    return EARTH_RADIUS_KM * c;
}

#endif // HAVERSINE_H
