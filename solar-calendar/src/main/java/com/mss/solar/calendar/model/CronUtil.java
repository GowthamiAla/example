package com.mss.solar.calendar.model;

import java.util.Calendar;
import java.util.Date;

public class CronUtil {

	private final Date mDate;
	private final Calendar mCal;
	private final String mSeconds = "0";
	private final String mDaysOfWeek = "?";

	private String mMins;
	private String mHours;
	private String mDaysOfMonth;
	private String mMonths;
	private String mYears;
	
	public CronUtil(Date pDate) {
		this.mDate = pDate;
		mCal = Calendar.getInstance();
		this.generateCronExpression();
	}

	private void generateCronExpression() {
		mCal.setTime(mDate);

		String hours = String.valueOf(mCal.get(Calendar.HOUR_OF_DAY));
		this.mHours = hours;

		String mins = String.valueOf(mCal.get(Calendar.MINUTE));
		this.mMins = mins;

		String days = String.valueOf(mCal.get(Calendar.DAY_OF_MONTH));
		this.mDaysOfMonth = days;

		String months = new java.text.SimpleDateFormat("MM").format(mCal.getTime());
		this.mMonths = months;

		String years = String.valueOf(mCal.get(Calendar.YEAR));
		this.mYears = years;

	}

	public String getmMins() {
		return mMins;
	}

	public void setmMins(String mMins) {
		this.mMins = mMins;
	}

	public String getmHours() {
		return mHours;
	}

	public void setmHours(String mHours) {
		this.mHours = mHours;
	}

	public String getmDaysOfMonth() {
		return mDaysOfMonth;
	}

	public void setmDaysOfMonth(String mDaysOfMonth) {
		this.mDaysOfMonth = mDaysOfMonth;
	}

	public String getmMonths() {
		return mMonths;
	}

	public void setmMonths(String mMonths) {
		this.mMonths = mMonths;
	}

	public String getmYears() {
		return mYears;
	}

	public void setmYears(String mYears) {
		this.mYears = mYears;
	}

	public Date getmDate() {
		return mDate;
	}

	public Calendar getmCal() {
		return mCal;
	}

	public String getmSeconds() {
		return mSeconds;
	}

	public String getmDaysOfWeek() {
		return mDaysOfWeek;
	}

	

}