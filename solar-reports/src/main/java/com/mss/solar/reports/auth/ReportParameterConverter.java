package com.mss.solar.reports.auth;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.Date;
import java.util.Locale;

import org.apache.log4j.Logger;
import org.eclipse.birt.core.format.DateFormatter;
import org.eclipse.birt.core.format.NumberFormatter;
import org.eclipse.birt.core.format.StringFormatter;
import org.eclipse.birt.report.engine.api.IScalarParameterDefn;
import com.ibm.icu.util.TimeZone;
import com.ibm.icu.util.ULocale;

/**
 @odo document me
 * Utilites class to convert report paramete value between object and string. 
 */

public class ReportParameterConverter {
	private static final Logger log = Logger
			.getLogger(ReportParameterConverter.class);
	private String format = null;
	private ULocale uLocale = null;
	private TimeZone timeZone = TimeZone.getDefault( );
	
	private StringFormatter sf = null;
	private DateFormatter df = null;
	private NumberFormatter nf = null;

	/**
	 * @param format format to format report parameter, or recover parameter value as object
	 * given a string as report parameter value
	 * @param locale the locale to format/parse the parameter value
	 */
	public ReportParameterConverter( String format, Locale locale )
	{
		this( format, ULocale.forLocale( locale ) );
	}
	
	/**
	 * Constructor.
	 * 
	 * @param format
	 * @param uLocale
	 */
	public ReportParameterConverter( String format, ULocale uLocale )
	{
		this( format, uLocale, null );
	}
	
	/**
	 * Constructor.
	 * 
	 * @param format
	 * @param uLocale
	 * @param timeZone
	 */
	public ReportParameterConverter( String format, ULocale uLocale,
			TimeZone timeZone )
	{
		this.format = format;
		this.uLocale = uLocale;
		if ( timeZone != null )
		{
			this.timeZone = timeZone;
		}
	}
	
	/**
	 * Get string formatter.
	 * 
	 * @return StringFormatter object
	 */
	private StringFormatter getStringFormatter( )
	{
		if ( sf == null && uLocale != null )
		{
			sf = new StringFormatter( uLocale );
			if ( format != null )
			{
				sf.applyPattern( format );
			}
		}
		return sf;
	}
	
	/**
	 * Get number formatter. 
	 * 
	 * @return NumberFormatter object
	 */
	private NumberFormatter getNumberFormatter( )
	{
		if ( nf == null && uLocale != null )
		{
			nf = new NumberFormatter( uLocale );
			if ( format != null )
			{
				nf.applyPattern( format );
			}
		}
		return nf;
	}
	
	/**
	 * Get date formatter.
	 * 
	 * @return DateFormatter object
	 */
	private DateFormatter getDateFormatter( )
	{
		if ( df == null && uLocale != null )
		{
			df = new DateFormatter( uLocale, timeZone );
			if ( format != null )
			{
				df.applyPattern( format );
			}
		}
		return df;
	}


	/**
	 * Convert report parameter value object into string.
	 * 
	 * @param reportParameterObj report parameter value object.
	 * @return parameter value in string.
	 */
	public String format( Object reportParameterObj )
	{
		String reportParameterValue = null;

		if (reportParameterObj != null && uLocale != null) {
			if (reportParameterObj instanceof String) {
				StringFormatter strf = getStringFormatter();
				if (strf != null) {
					reportParameterValue = strf
							.format((String) reportParameterObj);
				} else {
					reportParameterValue = reportParameterObj.toString();
				}
			} else if (reportParameterObj instanceof Date) {
				DateFormatter datef = getDateFormatter();
				if (datef != null) {
					reportParameterValue = datef
							.format((Date) reportParameterObj);
				} else {
					reportParameterValue = reportParameterObj.toString();
				}
			} else if (reportParameterObj instanceof Double) {
				NumberFormatter nof = getNumberFormatter();
				if (nof != null) {
					reportParameterValue = nof
							.format(((Double) reportParameterObj).doubleValue());
				} else {
					reportParameterValue = reportParameterObj.toString();
				}
			} else if (reportParameterObj instanceof BigDecimal) {
				NumberFormatter nof = getNumberFormatter();
				if (nof != null) {
					reportParameterValue = nof
							.format((BigDecimal) reportParameterObj);
				} else {
					reportParameterValue = reportParameterObj.toString();
				}
			} else if (reportParameterObj instanceof Boolean) {
				reportParameterValue = ((Boolean) reportParameterObj)
						.toString();
			} else if (reportParameterObj instanceof Number) {
				NumberFormatter nof = getNumberFormatter();
				if (nof != null) {
					reportParameterValue = nof
							.format((Number) reportParameterObj);
				} else {
					reportParameterValue = reportParameterObj.toString();
				}
			} else {
				reportParameterValue = reportParameterObj.toString();
			}
		}

		return reportParameterValue;
	}

	/**
	 * Convert report parameter from string into object. Need to be pointed out
	 * is it return a Double object when the value type is Float.
	 * 
	 * @param reportParameterValue
	 *            report parameter value in string.
	 * @param parameterValueType
	 *            report parameter type.
	 * @return parameter value object.
	 */
	public Object parse( String reportParameterValue, int parameterValueType )
	{
		Object parameterValueObj = null;

		if (reportParameterValue != null && uLocale != null) {
			switch (parameterValueType) {

			case IScalarParameterDefn.TYPE_STRING: {
				StringFormatter strf = getStringFormatter();
				if (strf == null) {
					parameterValueObj = null;
					break;
				}

				try {
					parameterValueObj = strf.parser(reportParameterValue);
				} catch (ParseException e) {
					parameterValueObj = reportParameterValue;
				}
				break;
			}

			case IScalarParameterDefn.TYPE_DATE_TIME: {
				parameterValueObj = parseDateTime(reportParameterValue);
				break;
			}

			case IScalarParameterDefn.TYPE_FLOAT: {
				NumberFormatter nof = getNumberFormatter();
				if (nof == null) {
					parameterValueObj = null;
					break;
				}

				try {
					Number num = nof.parse(reportParameterValue);

					if (num != null) {
						parameterValueObj = new Double(num.toString());
					}
				} catch (ParseException e) {
					nof.applyPattern("General Number");

					try {
						Number num = nof.parse(reportParameterValue);

						if (num != null) {
							parameterValueObj = new Double(num.toString());
						}
					} catch (ParseException ex) {
						parameterValueObj = null;
					}
				}

				break;
			}

			case IScalarParameterDefn.TYPE_DECIMAL: {
				NumberFormatter nof = getNumberFormatter();
				if (nof == null) {
					parameterValueObj = null;
					break;
				}

				try {
					Number num = nof.parse(reportParameterValue);

					if (num != null) {
						parameterValueObj = new BigDecimal(num.toString());
					}
				} catch (ParseException e) {
					nof.applyPattern("General Number");

					try {
						Number num = nof.parse(reportParameterValue);

						if (num != null) {
							parameterValueObj = new BigDecimal(num.toString());
						}
					} catch (ParseException ex) {
						parameterValueObj = null;
					}
				}

				break;
			}

			case IScalarParameterDefn.TYPE_BOOLEAN: {
				parameterValueObj = Boolean.valueOf(reportParameterValue);
				break;
			}

			case IScalarParameterDefn.TYPE_DATE: {
				try {
					parameterValueObj = java.sql.Date
							.valueOf(reportParameterValue);
				} catch (IllegalArgumentException ie) {
					log.error(ie);
					parameterValueObj = parseDateTime(reportParameterValue);
					if (parameterValueObj != null) {
						parameterValueObj = new java.sql.Date(
								((Date) parameterValueObj).getTime());
					}
				}
				break;
			}

			case IScalarParameterDefn.TYPE_TIME: {
				try {
					parameterValueObj = java.sql.Time
							.valueOf(reportParameterValue);
				} catch (IllegalArgumentException ie) {
					log.error(ie);
					parameterValueObj = parseDateTime(reportParameterValue);
					if (parameterValueObj != null) {
						parameterValueObj = new java.sql.Time(
								((Date) parameterValueObj).getTime());
					}
				}
				break;
			}

			// can use class DataTypeUtil to convert
			case IScalarParameterDefn.TYPE_INTEGER: {
				NumberFormatter nof = getNumberFormatter();
				if (nof == null) {
					parameterValueObj = null;
					break;
				}

				try {
					Number num = nof.parse(reportParameterValue);

					if (num != null) {
						parameterValueObj = Integer.valueOf(num.intValue());
					}
				} catch (ParseException ex) {
					nof.applyPattern("General Number");

					try {
						Number num = nof.parse(reportParameterValue);

						if (num != null) {
							parameterValueObj = Integer.valueOf(num.intValue());
						}
					} catch (ParseException pex) {
						try {
							parameterValueObj = Integer
									.valueOf(reportParameterValue);
						} catch (NumberFormatException nfe) {
							parameterValueObj = null;
						}
					}
				}
			}
			default:
			}

		}

		return parameterValueObj;
	}

	/**
	 * Parse the input string  to an object.
	 * 
	 * @param reportParameterValue
	 *                  input string to parse
	 * @return an object
	 */
	protected Object parseDateTime(String reportParameterValue) {
		DateFormatter datef = getDateFormatter();
		if (datef == null) {
			return null;
		}

		try {
			return datef.parse(reportParameterValue);
		} catch (ParseException e) {
			datef = new DateFormatter("Short Date", uLocale);
			try {
				return datef.parse(reportParameterValue);
			} catch (ParseException ex) {
				datef = new DateFormatter("Medium Time", uLocale);
				try {
					return datef.parse(reportParameterValue);
				} catch (ParseException exx) {
					return null;
				}
			}
		}
	}
}
