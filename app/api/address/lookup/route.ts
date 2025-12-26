import { NextRequest, NextResponse } from 'next/server';
import { validateUKPostcode, formatUKPostcode } from '@/lib/validation';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodeResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface PlaceResult {
  place_id: string;
  name?: string;
  vicinity?: string;
  formatted_address?: string;
  address_components?: AddressComponent[];
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!GOOGLE_API_KEY) {
      console.error('GOOGLE_PLACES_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Address lookup service is not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { postcode } = body;

    // Validate postcode format
    if (!postcode || typeof postcode !== 'string') {
      return NextResponse.json(
        { error: 'Postcode is required' },
        { status: 400 }
      );
    }

    if (!validateUKPostcode(postcode)) {
      return NextResponse.json(
        { error: 'Invalid UK postcode format. Expected format: SW1A 1AA' },
        { status: 400 }
      );
    }

    // Format the postcode
    const formattedPostcode = formatUKPostcode(postcode);

    // Step 1: Geocode the postcode to get latitude/longitude
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      formattedPostcode
    )}&region=uk&components=country:GB&key=${GOOGLE_API_KEY}`;

    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== 'OK' || !geocodeData.results || geocodeData.results.length === 0) {
      if (geocodeData.status === 'ZERO_RESULTS') {
        return NextResponse.json(
          { error: 'Postcode not found. Please check and try again.' },
          { status: 404 }
        );
      }

      console.error('Geocoding error:', geocodeData.status, geocodeData.error_message);
      return NextResponse.json(
        { error: 'Unable to lookup postcode. Please enter address manually.' },
        { status: 500 }
      );
    }

    const location = geocodeData.results[0].geometry.location;
    const { lat, lng } = location;

    // Step 2: Search for nearby addresses using the geocoded location
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=150&type=premise&key=${GOOGLE_API_KEY}`;

    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();

    if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', placesData.status, placesData.error_message);
      return NextResponse.json(
        { error: 'Unable to find addresses for this postcode. Please enter address manually.' },
        { status: 500 }
      );
    }

    // If no nearby places found, use geocoding result
    if (!placesData.results || placesData.results.length === 0) {
      const geocodeAddress = parseAddressComponents(
        geocodeData.results[0].address_components,
        formattedPostcode
      );

      if (geocodeAddress) {
        return NextResponse.json({
          addresses: [geocodeAddress],
        });
      }

      return NextResponse.json(
        { error: 'No specific addresses found for this postcode. Please enter address manually.' },
        { status: 404 }
      );
    }

    // Step 3: Parse the addresses from Places API results
    const addresses = placesData.results
      .map((place: PlaceResult) => {
        // Try to get address components from the place
        if (place.address_components && place.address_components.length > 0) {
          return parseAddressComponents(place.address_components, formattedPostcode);
        }

        // Fallback: use the formatted_address or vicinity
        const addressText = place.formatted_address || place.vicinity || place.name;
        if (!addressText) return null;

        // Try to extract street address from formatted text
        const addressParts = addressText.split(',').map((p) => p.trim());
        const streetAddress = addressParts[0] || addressText;

        return {
          formatted_address: addressText,
          address_line1: streetAddress,
          city: addressParts[1] || '',
          county: '',
          postcode: formattedPostcode,
          place_id: place.place_id,
        };
      })
      .filter((addr) => addr !== null && addr.address_line1.length > 0);

    // Remove duplicates based on address_line1
    const uniqueAddresses = addresses.filter(
      (addr, index, self) =>
        index === self.findIndex((a) => a.address_line1 === addr.address_line1)
    );

    // Sort addresses by street number if present
    const sortedAddresses = uniqueAddresses.sort((a, b) => {
      const numA = parseInt(a.address_line1.match(/^\d+/)?.[0] || '999999');
      const numB = parseInt(b.address_line1.match(/^\d+/)?.[0] || '999999');
      return numA - numB;
    });

    if (sortedAddresses.length === 0) {
      return NextResponse.json(
        { error: 'No addresses found for this postcode. Please enter address manually.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      addresses: sortedAddresses.slice(0, 20), // Limit to 20 results
    });
  } catch (error) {
    console.error('Address lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup address. Please try again or enter address manually.' },
      { status: 500 }
    );
  }
}

/**
 * Parse address components from Google Maps API result
 */
function parseAddressComponents(
  components: AddressComponent[],
  postcode: string
): {
  formatted_address: string;
  address_line1: string;
  city: string;
  county: string;
  postcode: string;
} | null {
  const streetNumber =
    components.find((comp) => comp.types.includes('street_number'))?.long_name || '';

  const route = components.find((comp) => comp.types.includes('route'))?.long_name || '';

  const city =
    components.find(
      (comp) =>
        comp.types.includes('postal_town') ||
        comp.types.includes('locality') ||
        comp.types.includes('sublocality')
    )?.long_name || '';

  const county =
    components.find((comp) => comp.types.includes('administrative_area_level_2'))?.long_name ||
    '';

  const addressLine1 = `${streetNumber} ${route}`.trim();

  if (!addressLine1 && !city) {
    return null;
  }

  const formattedAddress = [addressLine1, city, county, postcode]
    .filter((part) => part.length > 0)
    .join(', ');

  return {
    formatted_address: formattedAddress,
    address_line1: addressLine1 || city,
    city: city,
    county: county,
    postcode: postcode,
  };
}
